import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Dashboard from "./components/user-dashboard/UserDashboard";
import AdminDashboard from "./components/admin-dashboard/AdminDashboard";
import Login from "./components/login";
import { device } from "./utils/mediaQueries";

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;

  @media ${device.mobile} {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  @media ${device.mobile} {
    padding: 15px;
    margin-top: 60px; /* Space for mobile header */
  }
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <MainContainer>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/user-dashboard/*"
            element={
              user?.role === "agent" || user?.role === "teamlead" ? (
                <>
                  <Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-dashboard/*"
            element={
              user?.role === "admin" ? (
                <>
                  <AdminDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </MainContainer>
    </Router>
  );
};

export default App;