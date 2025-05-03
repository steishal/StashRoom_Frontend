
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/PostModule';
import styles from './Profile.module.css';

const ProfileModule = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Загрузка данных профиля
    const fetchProfile = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setProfileData(data);
      setIsFollowing(data.isFollowing);
    };
    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    // API call для подписки
    const response = await fetch(`/api/users/${userId}/follow`, {
      method: isFollowing ? 'DELETE' : 'POST',
    });
    if (response.ok) setIsFollowing(!isFollowing);
  };

  if (!profileData) return <div>Загрузка...</div>;

  return (
    <div className="content">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{profileData.username}</h1>
          <div className="profile-actions">
            <i className="fas fa-cog" onClick={() => {/* логика меню */}} />
            <div className="actions-menu">
              <Link to="/edit-profile">Редактировать профиль</Link>
              <Link to="/settings">Настройки</Link>
              <button className="delete-button">Выйти</button>
            </div>
          </div>
        </div>

        <div className="subscriptions-followers">
          <div className="subscriptions">
            <h2>Подписки</h2>
            <p>{profileData.followingCount}</p>
          </div>
          <div className="followers">
            <h2>Подписчики</h2>
            <p>{profileData.followersCount}</p>
          </div>
        </div>

        <button
          className={isFollowing ? 'unsubscribe-btn' : 'subscribe-btn'}
          onClick={handleFollow}
        >
          {isFollowing ? 'Отписаться' : 'Подписаться'}
        </button>
      </div>

      {profileData.posts.map(post => (
        <Post key={post.id} post={post} currentUserId={currentUser.id} />
      ))}
    </div>
  );
};

export default ProfileModule;
