import { useEffect, useState } from 'react';
import { getUrl } from 'aws-amplify/storage';
import './FileVersions.css';

export default function FileVersions({ fileKey, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [fileKey]);

  const fetchVersions = async () => {
    try {
      //To Get the API URL from Amplify outputs (or environment variable)
      const apiUrl = import.meta.env.VITE_API_URL; // from amplify_outputs.json
      const response = await fetch(`${apiUrl}/versions?key=${encodeURIComponent(fileKey)}`);
      const data = await response.json();
      setVersions(data.versions);
    } catch (error) {
      console.error('Failed to fetch versions', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadVersion = async (versionId) => {
    const url = await getUrl({
      key: fileKey,
      options: {
        accessLevel: 'private',
        versionId: versionId,
      },
    });
    window.open(url.url, '_blank');
  };

  if (loading) return <div>Loading versions...</div>;

  return (
    <div className="versions-modal">
      <div className="versions-content">
        <h3>Versions of {fileKey}</h3>
        <button onClick={onClose}>Close</button>
        <table>
          <thead>
            <tr>
              <th>Version ID</th>
              <th>Last Modified</th>
              <th>Latest</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.versionId}>
                <td>{v.versionId.substring(0, 8)}…</td>
                <td>{new Date(v.lastModified).toLocaleString()}</td>
                <td>{v.isLatest ? 'OK' : ''}</td>
                <td>
                  <button onClick={() => downloadVersion(v.versionId)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}