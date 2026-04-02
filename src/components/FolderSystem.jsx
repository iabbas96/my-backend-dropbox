import { useState } from 'react'
import { uploadData } from 'aws-amplify/storage'
import { getCurrentUser } from 'aws-amplify/auth'
import './FolderSystem.css'

function FolderSystem({ currentFolder, onFolderChange }) {
  const [newFolderName, setNewFolderName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const breadcrumbs = currentFolder ? currentFolder.split('/') : []

  const createFolder = async () => {
    if (!newFolderName.trim()) return
    setCreating(true)
    try {
      const { userId } = await getCurrentUser()
      const folderPath = currentFolder
        ? `private/${userId}/${currentFolder}/${newFolderName}/.keep`
        : `private/${userId}/${newFolderName}/.keep`

      await uploadData({
        path: folderPath,
        data: new Blob([''], { type: 'text/plain' })
      }).result

      setNewFolderName('')
      setShowInput(false)
      onFolderChange(currentFolder
        ? `${currentFolder}/${newFolderName}`
        : newFolderName)
    } catch (err) {
      console.error('Error creating folder:', err)
    } finally {
      setCreating(false)
    }
  }

  const navigateTo = (index) => {
    if (index < 0) {
      onFolderChange('')
    } else {
      onFolderChange(breadcrumbs.slice(0, index + 1).join('/'))
    }
  }

  return (
    <div className="folder-system">
      <div className="breadcrumbs">
        <span
          className="breadcrumb-item"
          onClick={() => navigateTo(-1)}
        >
          Home
        </span>
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <span className="breadcrumb-separator">/</span>
            <span
              className="breadcrumb-item"
              onClick={() => navigateTo(index)}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="folder-actions">
        {showInput ? (
          <div className="folder-input-row">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createFolder()}
              className="folder-input"
              autoFocus
            />
            <button
              className="btn-create-folder"
              onClick={createFolder}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn-new-folder"
            onClick={() => setShowInput(true)}
          >
            + New Folder
          </button>
        )}
      </div>
    </div>
  )
}

export default FolderSystem