import { useState } from 'react'
import { uploadData } from 'aws-amplify/storage'
import './UploadButton.css'

function UploadButton() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
        await uploadData({
        path: `public/${file.name}`,
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

      alert(`${file.name} The file is uploaded successfully!`)
    } catch (err) {
      console.error('Upload error:', err)
      alert('The file upload failed. Please try again.')
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