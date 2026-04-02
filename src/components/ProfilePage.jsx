import { useState, useEffect } from 'react'
import { getCurrentUser, fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth'
import { list } from 'aws-amplify/storage'
import './ProfilePage.css'

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ fileCount: 0, totalSize: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { userId, username } = await getCurrentUser()
        const attributes = await fetchUserAttributes()
        setUser({ userId, username, email: attributes.email })

        const result = await list({ path: `private/${userId}/` })
        const files = result.items.filter(f => !f.path.endsWith('/'))
        const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0)
        setStats({ fileCount: files.length, totalSize })
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) return <p className="profile-loading">Loading profile...</p>

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U'
  const totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2)

  return (
    <div className="profile-container">
      <div className="profile-avatar">{initials}</div>
      <div className="profile-info">
        <h2 className="profile-name">{user?.username}</h2>
        <p className="profile-email">{user?.email}</p>
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.fileCount}</span>
          <span className="stat-label">Files uploaded</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalSizeMB} MB</span>
          <span className="stat-label">Total storage used</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">5 GB</span>
          <span className="stat-label">Storage limit</span>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage