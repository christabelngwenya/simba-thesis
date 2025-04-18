import React from "react";
import styled, { keyframes } from "styled-components";
import { FaUsers, FaCalendarCheck, FaClock } from "react-icons/fa";
import { device } from "../../utils/mediaQueries";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.4); }
  100% { box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2); }
`;

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  width: 100%;
  background: linear-gradient(135deg, #1e1e30, #3d3d61);
  color: white;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;

  @media ${device.mobile} {
    padding: 15px;
    min-height: calc(100vh - 120px);
  }
`;

const AdminSection = styled.div`
  max-width: 700px;
  width: 100%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 1.2s ease-in-out;

  @media ${device.tablet} {
    padding: 30px;
  }

  @media ${device.mobile} {
    padding: 20px;
    backdrop-filter: blur(8px);
  }
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  animation: ${fadeIn} 1.5s ease;

  @media ${device.tablet} {
    font-size: 2rem;
  }

  @media ${device.mobile} {
    font-size: 1.8rem;
  }
`;

const AdminSubtitle = styled.p`
  font-size: 1.4rem;
  opacity: 0.9;
  animation: ${fadeIn} 1.8s ease;
  margin-bottom: 30px;

  @media ${device.tablet} {
    font-size: 1.2rem;
  }

  @media ${device.mobile} {
    font-size: 1.1rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
  flex-wrap: wrap;

  @media ${device.mobile} {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  animation: ${glow} 2s infinite alternate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media ${device.tablet} {
    width: 180px;
    padding: 15px;
  }

  @media ${device.mobile} {
    width: 100%;
    max-width: 250px;
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #ff4d4d;

  @media ${device.mobile} {
    font-size: 1.8rem;
  }
`;

const EncouragingText = styled.p`
  margin-top: 25px;
  font-size: 1.2rem;
  color: #ffcccb;
  font-weight: bold;
  animation: ${fadeIn} 2s ease-in-out;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #ff9999;
    transform: scale(1.05);
  }

  @media ${device.mobile} {
    font-size: 1.1rem;
    margin-top: 20px;
  }
`;

const AdminDashboard = () => {
  return (
    <AdminContainer>
      <AdminSection>
        <AdminTitle>Welcome to Admin Dashboard</AdminTitle>
        <AdminSubtitle>Manage shift schedules, employees, and reports all in one place.</AdminSubtitle>

        <StatsContainer>
          <StatBox>
            <StatIcon><FaUsers /></StatIcon>
            Total Employees: 2
          </StatBox>
          <StatBox>
            <StatIcon><FaClock /></StatIcon>
            Pending Requests: 5
          </StatBox>
        </StatsContainer>

        <EncouragingText>Explore employee performance & improve scheduling efficiency!</EncouragingText>
      </AdminSection>
    </AdminContainer>
  );
};

export default AdminDashboard;