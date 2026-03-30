import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import FileList from './components/FileList'
import UploadButton from './components/UploadButton'
import './App.css'

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <nav className="navbar">
            <h1>MyDropbox</h1>
            <div className="nav-right">
              <span>{user.username}</span>
              <button onClick={signOut}>Sign out</button>
            </div>
          </nav>
          <main className="main-content">
            <UploadButton />
            <FileList />
          </main>
        </div>
      )}
    </Authenticator>
  )
}

export default App