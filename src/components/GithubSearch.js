// GithubSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './GithubSearch.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PiBuildingsFill } from 'react-icons/pi';
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub } from 'react-icons/fa';

const GithubSearch = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) Fetch profile
      const profileRes = await axios.get(`https://api.github.com/users/${username}`);
      setProfile(profileRes.data);

      // 2) Fetch latest 5 repos
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
      );
      setRepos(reposRes.data);

      // 3) Fetch top 5 followers
      const followersRes = await axios.get(profileRes.data.followers_url);
      setFollowers(followersRes.data.slice(0, 5));

      setError(null);
    } catch (err) {
      setProfile(null);
      setRepos([]);
      setFollowers([]);
      if (err.response && err.response.status === 404) {
        setError('User Not Found');
      } else if (err.response && err.response.status === 403) {
        setError('API rate limit exceeded. Try again later.');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-heading">GitHub Profile Analyser</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter Github Username...."
          value={username}
          className="search-input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {loading && <div className="loader"></div>}
      {error && <p className="error-msg">{error}</p>}

      {profile && (
        <div className="profile-container">
          <div className="profile-content">
            <div className="profile-img">
              <img src={profile.avatar_url} alt="Avatar" className="profile-avatar" />
            </div>

            <div className="profile-details">
              <div className="profile-des">
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-created">
                  Joined: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>

              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="profile-username"
              >
                @{profile.login}
              </a>
              <p className="profile-bio">{profile.bio}</p>

              <div className="profile-stats">
                <p className="profile-repos">
                  Repositories<br/>
                  <span className="stats">{profile.public_repos}</span>
                </p>
                <p className="profile-followers">
                  Followers<br/>
                  <span className="stats">{profile.followers}</span>
                </p>
                <p className="profile-following">
                  Following<br/>
                  <span className="stats">{profile.following}</span>
                </p>
              </div>

              <div className="profile-info">
                <p className="profile-location">
                  <FaMapMarkerAlt /> {profile.location}
                </p>
                <p className="profile-company">
                  <PiBuildingsFill /> {profile.company}
                </p>
              </div>

              <div className="profile-links">
                <a
                  href={`https://twitter.com/${profile.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="twitter-link"
                >
                  <FaXTwitter /> {profile.twitter_username}
                </a>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="profile-url"
                >
                  <FaGithub /> View Profile
                </a>
              </div>
            </div>
          </div>

          {/* Latest Repos */}
          {repos.length > 0 && (
            <div className="repo-list">
              <h3>Latest Repositories</h3>
              <ul>
                {repos.map((repo) => (
                  <li key={repo.id}>
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>{' '}
                    ⭐ {repo.stargazers_count}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Followers */}
          {followers.length > 0 && (
            <div className="followers-list">
              <h3>Top Followers</h3>
              <div className="follower-items">
                {followers.map((f) => (
                  <a
                    key={f.id}
                    href={f.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="follower-item"
                  >
                    <img
                      src={f.avatar_url}
                      alt={f.login}
                      className="follower-avatar"
                    />
                    <p>{f.login}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GithubSearch;
