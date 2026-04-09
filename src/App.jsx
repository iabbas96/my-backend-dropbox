import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import FileUpload from './components/UploadButton';
import FileList from './components/FileList';
import Breadcrumbs from './components/Breadcrumbs';
import Profile from './components/Profile';
import FilePreview from './components/FilePreview';
import ShareLink from './components/ShareLink';
import CreateFolder from './components/CreateFolder';
import './App.css';

function App() {
  const [currentFolder, setCurrentFolder] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [shareFileKey, setShareFileKey] = useState(null);
  const [activePage, setActivePage] = useState('files'); 


  const handleFolderCreated = () => {
  setRefreshTrigger(prev => prev + 1); // forces FileList to reload
};

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app-container">
          <nav className="navbar">
            <h3>My Backend Dropbox</h3>
            <div>
              <button onClick={() => setActivePage('files')}>Files</button>
              <button onClick={() => setActivePage('profile')}>Profile</button>
              <button onClick={signOut}>Sign Out</button>
            </div>
          </nav>

          {activePage === 'files' && (
            <>
              <Breadcrumbs currentPath={currentFolder} onNavigate={setCurrentFolder} />
              <CreateFolder
                currentFolder={currentFolder}
                onFolderCreated={handleFolderCreated}
              />
              <FileUpload currentFolder={currentFolder} onUploadComplete={handleUploadComplete} />
              <FileList
                currentFolder={currentFolder}
                refreshTrigger={refreshTrigger}
                onFolderOpen={setCurrentFolder}
                onShare={setShareFileKey}
                onPreview={setSelectedPreviewFile}
              />
            </>
          )}

          {activePage === 'profile' && <Profile />}

          {selectedPreviewFile && (
            <FilePreview fileKey={selectedPreviewFile} onClose={() => setSelectedPreviewFile(null)} />
          )}

          {shareFileKey && (
            <ShareLink fileKey={shareFileKey} onClose={() => setShareFileKey(null)} />
          )}
        </div>
      )}
    </Authenticator>
  );
}

export default App;