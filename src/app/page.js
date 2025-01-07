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
    const file = e.target.files[0];
    if (type === 'followers') {
      setFollowersFile(file);
    } else {
      setFollowingFile(file);
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
      // Replace with your own backend if needed
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
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.title}>Instagram Follower Checker</h1>
        </header>

        {/* MAIN */}
        <main className={styles.main}>
          <div className={styles.bubble}>
            <h2>How it Works</h2>
            <p>
              Download your Instagram <b>followers</b> and <b>following</b> lists, <br/>
              then upload them here. Hit <b>Compare</b> to see who isn’t following you back.
            </p>
          </div>

          {/* UPLOAD BUBBLE */}
          <div className={styles.bubble}>
            <h2>Upload Your Lists</h2>

            <div className={styles.fileUploadRow}>

              {/* Followers */}
              <div className={styles.fileUploadBox}>
                <label className={styles.label}>Followers List:</label>
                <div className={styles.customFileContainer}>
                  <label htmlFor="fileFollowers" className={styles.customFileButton}>
                    Choose file
                  </label>
                  {/* The hidden native input */}
                  <input
                      id="fileFollowers"
                      type="file"
                      className={styles.hiddenFileInput}
                      onChange={(e) => handleFileChange(e, 'followers')}
                  />
                  {/* Show file name if selected, else "No file chosen" */}
                  <span className={styles.fileNameSpan}>
                  {followersFile ? followersFile.name : 'No file chosen'}
                </span>
                </div>
              </div>

              {/* Following */}
              <div className={styles.fileUploadBox}>
                <label className={styles.label}>Following List:</label>
                <div className={styles.customFileContainer}>
                  <label htmlFor="fileFollowing" className={styles.customFileButton}>
                    Choose file
                  </label>
                  <input
                      id="fileFollowing"
                      type="file"
                      className={styles.hiddenFileInput}
                      onChange={(e) => handleFileChange(e, 'following')}
                  />
                  <span className={styles.fileNameSpan}>
                  {followingFile ? followingFile.name : 'No file chosen'}
                </span>
                </div>
              </div>
            </div>

            <button className={styles.compareButton} onClick={handleCompare}>
              Compare
            </button>
          </div>

          {/* RESULTS BUBBLE */}
          <div className={styles.bubble}>
            <h2 className={styles.header2}>Not Following You Back:</h2>
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

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerBubble}>
            <p>
              <b>Disclaimer:</b> This tool is not affiliated with or endorsed by Instagram.
              <br/>
              All processing is done locally. We do not store your data.
            </p>
          </div>
          <div className={styles.footerBubble}>
            <p>© 2025 Follower checker LLC. All rights reserved.</p>
          </div>
        </footer>
      </div>
  );
}
