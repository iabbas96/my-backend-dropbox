import { useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import FileList from './components/FileList'
import UploadButton from './components/UploadButton'
import ProfilePage from './components/ProfilePage'
import FolderSystem from './components/FolderSystem'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('files')
  const [currentFolder, setCurrentFolder] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedFileKey, setSelectedFileKey] = useState(null);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <nav className="navbar">
            <h1 className="nav-logo">My-Backend-Dropbox</h1>
            <div className="nav-links">
              <button
                className={`nav-btn ${activePage === 'files' ? 'active' : ''}`}
                onClick={() => setActivePage('files')}
              >
                My Files
              </button>
              <button
                className={`nav-btn ${activePage === 'profile' ? 'active' : ''}`}
                onClick={() => setActivePage('profile')}
              >
                Profile
              </button>
            </div>
            <div className="nav-right">
              <span className="nav-user">{user?.signInDetails?.loginId}</span>
              <button className="btn-signout" onClick={signOut}>
                Sign out
              </button>
            </div>
          </nav>

          <main className="main-content">
            {activePage === 'files' && (
              <>
                <FolderSystem
                  currentFolder={currentFolder}
                  onFolderChange={setCurrentFolder}
                />
                <UploadButton
                  currentFolder={currentFolder}
                  onUploadComplete={handleUploadComplete}
                />
                <FileList
                  currentFolder={currentFolder}
                  refreshTrigger={refreshTrigger}
                  onFolderOpen={setCurrentFolder}
                  onShowVersions={setSelectedFileKey}
                />

                {selectedFileKey && (
                <FileVersions
                  fileKey={selectedFileKey}
                  onClose={() => setSelectedFileKey(null)}
                />)}
                
              </>
            )}
            {activePage === 'profile' && <ProfilePage />}
          </main>
        </div>
      )}
    </Authenticator>
  )
}

export default App