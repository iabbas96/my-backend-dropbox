import { useState, useEffect, useRef } from 'react';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchUserAttributes()
      .then(attrs => {
        setUser(attrs);
        setGivenName(attrs.given_name || '');
        setFamilyName(attrs.family_name || '');
        setPhone(attrs.phone_number || '');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load user profile');
      });
  }, []);

  const formatPhoneNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (!value.startsWith('+')) {
      return `+234${digits}`; // Nigeria country code
    }
    return `+${digits}`;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const formattedPhone = formatPhoneNumber(phone);

    try {
      await updateUserAttributes({
        userAttributes: {
          given_name: givenName,
          family_name: familyName,
          phone_number: formattedPhone,
        }
      });
      setMessage('Profile updated successfully!');
      timeoutRef.current = setTimeout(() => setMessage(''), 3000);
      // for clearing the fields after successfully updating the user profile.
    //   setGivenName('');
    //   setFamilyName('');
    //   setPhone('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error updating profile');
      timeoutRef.current = setTimeout(() => setError(''), 5000);
    }
  };

  if (!user && !error) return <div className="profile-container">Loading...</div>;
  if (error && !user) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>
        <div className="form-group">
          <label>Given Name</label>
          <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Family Name</label>
          <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+2348061607977"
          />
        </div>
        <button type="submit" className="update-button">Update Profile</button>
      </form>
      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}