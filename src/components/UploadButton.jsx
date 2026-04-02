import { useState } from 'react'
import { uploadData } from 'aws-amplify/storage'
import { fetchAuthSession } from 'aws-amplify/auth'
import './UploadButton.css'

function UploadButton({ currentFolder, onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

const handleUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  setUploading(true)
  setProgress(0)

  try {
    const session = await fetchAuthSession()
    const identityId = session.identityId

    if (!identityId) {
      alert('Authentication error. Please sign out and sign in again.')
      return
    }

    const folder = currentFolder ? `${currentFolder}/` : ''
    const filePath = `private/${identityId}/${folder}${file.name}`

    await uploadData({
      path: filePath,
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const pct = Math.round((transferredBytes / totalBytes) * 100)
            setProgress(pct)
          }
        }
      }
    }).result

    alert(`${file.name} uploaded successfully!`)
    if (onUploadComplete) onUploadComplete()
  } catch (err) {
    console.error('Upload error:', err)
    alert('Upload failed. Please try again.')
  } finally {
    setUploading(false)
    setProgress(0)
  }
}

  return (
    <div className="upload-container">
      <label className="upload-label">
        {uploading ? `Uploading... ${progress}%` : '+ Upload File'}
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="upload-input"
        />
      </label>
      {uploading && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default UploadButton