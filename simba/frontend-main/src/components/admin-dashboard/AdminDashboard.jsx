import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./AdminHeader";
import AdminSidebar from './AdminSidebar';
import UserManagement from './UserManagement';
import ShiftManagement from './ShiftManagement';
import OvertimeManagement from './OvertimeManagement';
import AdminShiftSwapRequests from './SwapRequests';
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Home from "./AdminHome";
import TeamView from "../user-dashboard/TeamView";
import { device } from "../../utils/mediaQueries";

const DashboardContainer = styled.div`
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
      case "user-management":
        return <UserManagement />;
      case "shift-management":
        return <ShiftManagement />;
      case "swap-requests":
        return <AdminShiftSwapRequests/>;
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
      <DashboardContainer>
        <AdminSidebar 
          setActiveSection={setActiveSection} 
          isOpen={sidebarOpen} 
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        <MainContent sidebarOpen={sidebarOpen}>
          {renderSection()}
        </MainContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;