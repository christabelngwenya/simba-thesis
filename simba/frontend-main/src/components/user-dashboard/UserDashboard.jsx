import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "./UserHeader";
import UserSidebar from "./UserSidebar";
import Home from "./UserHome";
import ShiftPreferences from "./ShiftPreferences";
import ShiftSchedule from "./ShiftSchedule";
import ShiftSwapRequests from "./ShiftSwapRequests";
import OvertimeManagement from "./OvertimeManagement";
import TeamView from "./TeamView";
import { device } from "../../utils/mediaQueries";

const UserDashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;

  @media ${device.tablet} {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  margin-left: ${props => props.sidebarOpen ? '250px' : '70px'};
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px); /* Adjust based on header height */
  margin-top: 60px; /* Height of header */

  @media ${device.laptop} {
    margin-left: ${props => props.sidebarOpen ? '200px' : '70px'};
  }

  @media ${device.tablet} {
    margin-left: 0;
    padding: 15px;
    margin-top: 60px;
  }

  @media ${device.mobile} {
    padding: 10px;
    margin-top: 60px;
  }
`;

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "shift-preferences":
        return <ShiftPreferences />;
      case "shift-schedule":
        return <ShiftSchedule />;
      case "shift-swap-requests":
        return <ShiftSwapRequests />;
      case "overtime-management":
        return <OvertimeManagement />;
      case "team-view":
        return <TeamView />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <UserDashboardContainer>
        <UserSidebar 
          setActiveSection={setActiveSection} 
          isOpen={sidebarOpen} 
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        <MainContent sidebarOpen={sidebarOpen}>
          {renderSection()}
        </MainContent>
      </UserDashboardContainer>
    </>
  );
};

export default Dashboard;