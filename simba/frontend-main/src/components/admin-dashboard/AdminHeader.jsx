import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

// Reuse the same styled components from UserHeader.js
// (You might want to move these to a shared file)
import {
  HeaderContainer,
  LogoContainer,
  Logo,
  CalendarIcon,
  Tagline,
  ActionsContainer,
  IconContainer,
  NotificationBadge,
  ProfileContainer,
  ProfileName,
  ProfileImage,
  InitialsCircle,
  getInitials
} from './UserHeader';

const AdminHeader = () => {
  const { currentUser, logout } = useAuth();

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo>
          <CalendarIcon icon={faCalendarAlt} />
          <span>Shift Schedule Admin</span>
        </Logo>
        <Tagline>Optimizing workforce management</Tagline>
      </LogoContainer>
      
      <ActionsContainer>
  
        
        <ProfileContainer onClick={logout}>
          <ProfileImage>
            {currentUser ? (
              <InitialsCircle>
                {getInitials(currentUser.username)}
              </InitialsCircle>
            ) : (
              <FontAwesomeIcon icon={faUserCircle} />
            )}
          </ProfileImage>
          <ProfileName>{currentUser?.username || 'Admin'}</ProfileName>
        </ProfileContainer>
      </ActionsContainer>
    </HeaderContainer>
  );
};

export default AdminHeader;