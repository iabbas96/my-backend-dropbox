import { useState } from 'react'
import { list, getUrl } from 'aws-amplify/storage'
import './VersionHistory.css'

function VersionHistory({ filePath, onClose }) {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    const fetchVersions = async () => {
      try {
        const result = await list({
          path: filePath,
          options: { listAllFiles: true }
        })
        setVersions(result.items)
      } catch (err) {
        console.error('Error fetching versions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVersions()
  }, [filePath])

  const handleDownloadVersion = async (path) => {
    try {
      const url = await getUrl({
        path,
        options: { expiresIn: 300 }
      })
      window.open(url.url, '_blank')
    } catch (err) {
      console.error('Download version error:', err)
    }
  }

  return (
    <div className="version-overlay">
      <div className="version-modal">
        <div className="version-header">
          <h3 className="version-title">Version History</h3>
          <button className="version-close" onClick={onClose}>x</button>
        </div>
        {loading ? (
          <p className="version-loading">Loading versions...</p>
        ) : versions.length === 0 ? (
          <p className="version-empty">No versions found.</p>
        ) : (
          <div className="version-list">
            {versions.map((v, index) => (
              <div key={v.path} className="version-item">
                <div className="version-info">
                  <span className="version-label">
                    {index === 0 ? 'Current version' : `Version ${versions.length - index}`}
                  </span>
                  <span className="version-size">
                    {v.size ? `${(v.size / 1024).toFixed(1)} KB` : ''}
                  </span>
                  <span className="version-date">
                    {v.lastModified
                      ? new Date(v.lastModified).toLocaleString()
                      : ''}
                  </span>
                </div>
                <button
                  className="btn-download-version"
                  onClick={() => handleDownloadVersion(v.path)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VersionHistory