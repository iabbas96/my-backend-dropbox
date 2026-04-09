import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import './CreateFolder.css';

export default function CreateFolder({ currentFolder, onFolderCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const identityId = session.identityId;
      const folderPath = `private/${identityId}/${currentFolder ? currentFolder + '/' : ''}${folderName}/`; // trailing slash marks a folder
      await uploadData({
        path: folderPath,
        data: '',
        options: { contentType: 'application/x-directory' }
      });
      alert(`Folder "${folderName}" created!`);
      setFolderName('');
      setIsOpen(false);
      if (onFolderCreated) onFolderCreated(); // refresh file list
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-folder">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="btn-new-folder">
          + New Folder
        </button>
      ) : (
        <div className="folder-input-group">
          <input
            type="text"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
          />
          <button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}