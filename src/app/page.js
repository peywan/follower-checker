// src/app/page.js

import React, { useState } from 'react';

export default function Home() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!followersFile || !followingFile) {
      alert('Please upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('followers', followersFile);
    formData.append('following', followingFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  };

  return (
      <div>
        <h1>Instagram Follower Checker</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Upload Followers File:</label>
            <input
                type="file"
                accept=".html"
                onChange={(e) => handleFileChange(e, setFollowersFile)}
            />
          </div>
          <div>
            <label>Upload Following File:</label>
            <input
                type="file"
                accept=".html"
                onChange={(e) => handleFileChange(e, setFollowingFile)}
            />
          </div>
          <button type="submit">Check</button>
        </form>
        {result && (
            <div>
              <h2>Users Not Following You Back:</h2>
              <ul>
                {result.notFollowingBack.map((user) => (
                    <li key={user}>{user}</li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
}
