import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell, faCog, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 12px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Logo = styled.div`
  font-size: 1.4em;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CalendarIcon = styled(FontAwesomeIcon)`
  color: #f1c40f;
`;

const Tagline = styled.span`
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  white-space: nowrap;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  margin-left: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    color: white;
    transform: translateY(-2px);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6em;
  font-weight: bold;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ProfileName = styled.span`
  font-size: 0.95em;
  color: white;
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const InitialsCircle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  font-size: 0.8em;
`;

const getInitials = (name) => {
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const UserHeader = () => {
  const { currentUser, logout } = useAuth();

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo>
          <CalendarIcon icon={faCalendarAlt} />
          <span>Shift Schedule</span>
        </Logo>
        <Tagline>Your personalized shift manager</Tagline>
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
          <ProfileName>{currentUser?.username || 'Guest'}</ProfileName>
        </ProfileContainer>
      </ActionsContainer>
    </HeaderContainer>
  );
};

export default UserHeader;