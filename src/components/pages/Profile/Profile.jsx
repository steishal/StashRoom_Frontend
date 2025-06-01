import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileView from './ProfileView.jsx';
import {useUserController} from "../../../controllers/UserController.js";
import {useFollowerController} from "../../../controllers/FollowerController.js";
import {UserService} from "../../../services/userService.js";

const ProfileModule = () => {
  const { userId } = useParams();
  const { currentUser } = useUserController();
  const {
    followers,
    following,
    isFollowing,
    isLoading: isFollowerLoading,
    error: followerError,
    toggleFollow,
  } = useFollowerController(userId);

  const [profileData, setProfileData] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await UserService.getUserById(userId);
        setProfileData(data);
      } catch (error) {
        setProfileError(error.message || 'Ошибка загрузки профиля');
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return (
      <ProfileView
          isLoading={isProfileLoading || isFollowerLoading}
          error={profileError || followerError}
          profileData={profileData}
          currentUser={currentUser}
          userId={userId}
          followers={followers}
          following={following}
          isFollowing={isFollowing}
          toggleFollow={toggleFollow}
      />
  );
};

export default ProfileModule;
