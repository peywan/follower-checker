'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e, type) => {
    if (type === 'followers') {
      setFollowersFile(e.target.files[0]);
    } else {
      setFollowingFile(e.target.files[0]);
    }
  };

  // Handle Compare button click
  const handleCompare = async () => {
    if (!followersFile || !followingFile) {
      alert('Please upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('followers', followersFile);
    formData.append('following', followingFile);

    try {
      // Replace with your actual backend if needed
      const res = await fetch('http://127.0.0.1:5000/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.notFollowingBack);
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
        <header className={styles.header}>
          <h1 className={styles.title}>Instagram Follower Checker</h1>
        </header>

        <main className={styles.main}>
          {/* Instructions box */}
          <div className={`${styles.box} ${styles.instructions}`}>
            <p><b>Follow these steps:</b></p>
            <ol>
              <li>Download your Instagram followers and following lists.</li>
              <li>Upload the files in the respective fields below.</li>
              <li>
                Click <b>Compare</b> to find out who isn’t following you back!
              </li>
            </ol>
          </div>

          {/* File-upload box */}
          <div className={`${styles.box} ${styles.card}`}>
            <label className={styles.label}>Upload Followers List:</label>
            <input
                type="file"
                className={styles.fileInput}
                onChange={(e) => handleFileChange(e, 'followers')}
            />

            <label className={styles.label}>Upload Following List:</label>
            <input
                type="file"
                className={styles.fileInput}
                onChange={(e) => handleFileChange(e, 'following')}
            />

            <button className={styles.compareButton} onClick={handleCompare}>
              Compare
            </button>
          </div>

          {/* Results section */}
          <div className={styles.results}>
            <h2>Not Following Back:</h2>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.resultGrid}>
              {results.map((user, index) => (
                  <div key={index} className={styles.resultBox}>
                    <a
                        href={user.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      {user.username}
                    </a>
                  </div>
              ))}
            </div>
          </div>
        </main>
      </div>
  );
}
