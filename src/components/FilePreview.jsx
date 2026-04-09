import { useEffect, useState } from 'react';
import { getUrl } from 'aws-amplify/storage';
import './FilePreview.css';

export default function FilePreview({ fileKey, onClose }) {
  const [url, setUrl] = useState('');
  const [isImage, setIsImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = async () => {
      const signedUrl = await getUrl({
        key: fileKey,
        options: { accessLevel: 'private' }
      });
      setUrl(signedUrl.url);
      // Simple MIME detection from file extension
      const ext = fileKey.split('.').pop().toLowerCase();
      setIsImage(['jpg','jpeg','png','gif','webp','bmp'].includes(ext));
      setLoading(false);
    };
    fetchUrl();
  }, [fileKey]);

  return (
    <div className="preview-modal">
      <div className="preview-content">
        <button onClick={onClose}>Close</button>
        <h3>{fileKey}</h3>
        {loading && <p>Loading preview...</p>}
        {!loading && isImage && <img src={url} alt="Preview" style={{ maxWidth: '100%' }} />}
        {!loading && !isImage && (
          <div>
            <p>Preview not available for this file type.</p>
            <a href={url} download>Download file</a>
          </div>
        )}
      </div>
    </div>
  );
}