import { useState, useEffect } from 'react'
import { list, getUrl, remove } from 'aws-amplify/storage'
import './FileList.css'

function FileList() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const result = await list({ path: 'public/' })
      setFiles(result.items)
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDownload = async (key) => {
    try {
      const url = await getUrl({ path: `public/${key}` })
      window.open(url.url, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete ${key}?`)) return
    try {
        await remove({ path: `public/${key}` })
        setFiles(files.filter(f => f.path !== `public/${key}`))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  if (loading) return <p className="file-loading">Loading files...</p>
  if (files.length === 0) return <p className="file-empty">No files uploaded yet.</p>

  return (
    <div className="file-list">
        {files.map((file) => (
        <div key={file.path} className="file-card">
            <div className="file-info">
            <span className="file-name">
                {file.path.replace('public/', '')}
            </span>
            <span className="file-size">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
            </span>
            </div>
            <div className="file-actions">
            <button
                className="btn-download"
                onClick={() => handleDownload(file.path.replace('public/', ''))}
            >
                Download
            </button>
            <button
                className="btn-delete"
                onClick={() => handleDelete(file.path.replace('public/', ''))}
            >
                Delete
            </button>
            </div>
        </div>
        ))}
      <button className="btn-refresh" onClick={fetchFiles}>
        Refresh
      </button>
    </div>
  )
}

export default FileList