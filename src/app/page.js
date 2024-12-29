'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e, type) => {
    if (type === 'followers') {
      setFollowersFile(e.target.files[0]);
    } else {
      setFollowingFile(e.target.files[0]);
    }
  };

  const handleCompare = async () => {
    if (!followersFile || !followingFile) {
      setError('Please upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('followers', followersFile);
    formData.append('following', followingFile);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.notFollowingBack || []);
        setError('');
      } else {
        setError(data.error || 'An error occurred.');
        setResults([]);
      }
    } catch (err) {
      setError('Failed to connect to backend.');
      setResults([]);
    }
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.title}>Instagram Follower Checker</h1>
        <div className={styles.instructions}>
          <p>Follow these steps:</p>
          <ol>
            <li>Download your Instagram followers and following lists.</li>
            <li>Upload the files in the respective fields below.</li>
            <li>Click <b>Compare</b> to find out who isn’t following you back.</li>
          </ol>
        </div>

        <div className={styles.uploadSection}>
          <div>
            <label>Upload Followers List:</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'followers')} />
          </div>
          <div>
            <label>Upload Following List:</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'following')} />
          </div>
        </div>

        <button onClick={handleCompare}>Compare</button>

        <div className={styles.resultSection}>
          {error && <p className={styles.error}>{error}</p>}
          {results.length > 0 ? (
              <>
                <h2>Not Following Back:</h2>
                <ul>
                  {results.map((user, index) => (
                      <li key={index}>{user}</li>
                  ))}
                </ul>
              </>
          ) : (
              <p>No results yet.</p>
          )}
        </div>
      </div>
  );
}
