import { useState, useEffect } from 'react'
import { list, getUrl, remove } from 'aws-amplify/storage'
import { fetchAuthSession } from 'aws-amplify/auth'
import './FileList.css'

function FileList({ currentFolder, refreshTrigger, onFolderOpen }) {
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

const fetchFiles = async () => {
  setLoading(true)
  try {
    const session = await fetchAuthSession()
    const identityId = session.identityId
    
    if (!identityId) {
      console.error('No identity ID found')
      setLoading(false)
      return
    }

    const basePath = `private/${identityId}/${currentFolder ? currentFolder + '/' : ''}`
    const result = await list({ path: basePath })

    const seenFolders = new Set()
    const fileItems = []
    const folderItems = []

    result.items.forEach(item => {
      const relativePath = item.path.replace(basePath, '')
      if (!relativePath) return

      const parts = relativePath.split('/')
      if (parts.length > 1) {
        const folderName = parts[0]
        if (!seenFolders.has(folderName) && folderName !== '') {
          seenFolders.add(folderName)
          folderItems.push(folderName)
        }
      } else if (parts[0] !== '.keep' && parts[0] !== '') {
        fileItems.push(item)
      }
    })

    setFolders(folderItems)
    setFiles(fileItems)
  } catch (err) {
    console.error('Error fetching files:', err)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchFiles() }, [currentFolder, refreshTrigger])

  const handleDownload = async (path) => {
    try {
      const url = await getUrl({ path, options: { expiresIn: 3600 } })
      window.open(url.url, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handleDelete = async (path) => {
    if (!window.confirm('Delete this file?')) return
    try {
      await remove({ path })
      setFiles(files.filter(f => f.path !== path))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const getFileName = (path) => path.split('/').pop()
  const isImage = (path) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path)

  if (loading) return <p className="file-loading">Loading...</p>

  return (
    <div className="file-list">
      {folders.length === 0 && files.length === 0 && (
        <p className="file-empty">No files or folders here yet.</p>
      )}

      {folders.map(folder => (
        <div
          key={folder}
          className="folder-card"
          onClick={() => onFolderOpen(
            currentFolder ? `${currentFolder}/${folder}` : folder
          )}
        >
          <span className="folder-icon">📁</span>
          <span className="folder-name">{folder}</span>
        </div>
      ))}

      {files.map(file => (
        <div key={file.path} className="file-card">
          {isImage(file.path) && (
            <ImagePreview path={file.path} />
          )}
          <div className="file-info">
            <span className="file-name">{getFileName(file.path)}</span>
            <span className="file-size">
              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
            </span>
          </div>
          <div className="file-actions">
            <button className="btn-download" onClick={() => handleDownload(file.path)}>
              Download
            </button>
            <button className="btn-delete" onClick={() => handleDelete(file.path)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <button className="btn-refresh" onClick={fetchFiles}>Refresh</button>
    </div>
  )
}

function ImagePreview({ path }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    getUrl({ path, options: { expiresIn: 3600 } })
      .then(url => setSrc(url.url.toString()))
      .catch(console.error)
  }, [path])

  if (!src) return <div className="file-preview-placeholder" />
  return <img src={src} alt="preview" className="file-preview" />
}

export default FileList