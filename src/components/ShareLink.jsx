import { useState } from 'react';
import { getUrl } from 'aws-amplify/storage';
import './ShareLink.css';

export default function ShareLink({ fileKey, onClose }) {
  const [link, setLink] = useState('');
  const [expiryDays, setExpiryDays] = useState(1);
  const [generated, setGenerated] = useState(false);

  const generateLink = async () => {
    const expiresIn = expiryDays * 86400;
    try {
      const result = await getUrl({
        path: fileKey,
        options: { expiresIn }
      });
      setLink(result.url);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate link. Check console.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="share-modal">
      <div className="share-content">
        <button onClick={onClose}>Close</button>
        <h3>Share: {fileKey.split('/').pop()}</h3>
        <label>Expires after (days):</label>
        <select value={expiryDays} onChange={(e) => setExpiryDays(Number(e.target.value))}>
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
        <button onClick={generateLink}>Generate shareable link</button>
        {generated && (
          <div>
            <input type="text" readOnly value={link} />
            <button onClick={copyToClipboard}>Copy link</button>
          </div>
        )}
      </div>
    </div>
  );
}