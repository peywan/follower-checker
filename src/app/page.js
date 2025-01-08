// page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);

  // Animated background effect
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setGradientPosition((prev) => (prev + 0.1) % 200);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Random pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const pulseElement = document.createElement('div');
      pulseElement.className = styles.pulse;
      pulseElement.style.left = `${Math.random() * 100}%`;
      pulseElement.style.top = `${Math.random() * 100}%`;
      document.querySelector(`.${styles.container}`)?.appendChild(pulseElement);

      setTimeout(() => pulseElement.remove(), 5000);
    }, 6000);

    return () => clearInterval(interval);
  }, [styles.container, styles.pulse]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'followers') {
      setFollowersFile(file);
    } else {
      setFollowingFile(file);
    }
  };

  const handleCompare = async () => {
    if (!followersFile || !followingFile) {
      alert('Please upload both files.');
      return;
    }

    setIsResultsVisible(false);

    const formData = new FormData();
    formData.append('followers', followersFile);
    formData.append('following', followingFile);

    try {
      const res = await fetch('https://follower-checker.onrender.com/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Group results in sets of 4
        const groupedResults = [];
        for (let i = 0; i < data.notFollowingBack.length; i += 4) {
          groupedResults.push(data.notFollowingBack.slice(i, i + 4));
        }
        setResults(groupedResults);
        setError('');
        setIsResultsVisible(true);
      } else {
        setError(data.error || 'An error occurred.');
        setResults([]);
      }
    } catch (err) {
      setError('Failed to connect to backend.');
      setResults([]);
    }
  };

  const containerStyle = {
    background: `linear-gradient(${gradientPosition}deg, #f58529 0%, #dd2a7b 40%, #8134af 65%, #515bd4 100%)`,
  };

  return (
      <div className={styles.container} style={containerStyle}>
        <header className={styles.header}>
          <h1 className={styles.title}>Instagram Follower Checker by Peywan</h1>
        </header>

        <main className={styles.main}>
          <div className={styles.bubble}>
            <h2>How it Works</h2>
            <p>
              Download your Instagram <b>followers</b> and <b>following</b> lists,
              then upload them here.
            </p>
          </div>

          <div className={styles.bubble}>
            <h2>Upload Your Lists</h2>
            <div className={styles.fileUploadRow}>
              {/* File upload boxes */}
              {['followers', 'following'].map((type) => (
                  <div key={type} className={styles.fileUploadBox}>
                    <label className={styles.label}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} List:
                    </label>
                    <div className={styles.customFileContainer}>
                      <label
                          htmlFor={`file${type}`}
                          className={styles.customFileButton}
                      >
                        Choose file
                      </label>
                      <input
                          id={`file${type}`}
                          type="file"
                          className={styles.hiddenFileInput}
                          onChange={(e) => handleFileChange(e, type)}
                      />
                      <span
                          className={styles.fileNameSpan}
                          title={
                            type === 'followers'
                                ? followersFile?.name
                                : followingFile?.name
                          }
                      >
                    {type === 'followers'
                        ? followersFile?.name || 'No file chosen'
                        : followingFile?.name || 'No file chosen'}
                  </span>
                    </div>
                  </div>
              ))}
            </div>
            <button className={styles.compareButton} onClick={handleCompare}>
              Compare
            </button>
          </div>

          {isResultsVisible && (
              <div
                  className={`${styles.bubble} ${styles.resultsContainer}`}
                  data-visible={isResultsVisible}
              >
                <h2 className={styles.header2}>Not Following You Back:</h2>
                {error && <p className={styles.error}>{error}</p>}
                {results.map((group, groupIndex) => (
                    <div key={groupIndex} className={styles.resultGrid}>
                      {group.map((user, index) => (
                          <div
                              key={index}
                              className={styles.resultBox}
                              title={user.username}
                          >
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
                ))}
              </div>
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <p>
              <b>Disclaimer:</b> This tool is not affiliated with Instagram.
            </p>
            <p>© 2025 Follower Checker</p>
          </div>
        </footer>
      </div>
  );
}
