import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faCalendarAlt, 
  faClock, 
  faExchangeAlt, 
  faBusinessTime, 
  faUsers, 
  faSignOutAlt, 
  faBars, 
  faTimes 
} from "@fortawesome/free-solid-svg-icons";

const SidebarContainer = styled.nav`
  background: linear-gradient(145deg, #2f3b52, #1c2639);
  color: white;
  width: ${(props) => (props.isOpen ? "250px" : props.isMobile ? "0" : "70px")};
  height: 100vh;
  padding: ${(props) => (props.isOpen ? "20px" : props.isMobile ? "0" : "20px")};
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s ease-in-out;
  position: fixed;
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${(props) => (props.isOpen ? "250px" : "0")};
    padding: ${(props) => (props.isOpen ? "20px" : "0")};
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  margin-bottom: 20px;
  align-self: ${(props) => (props.isOpen ? "flex-end" : "center")};
  &:focus { outline: none; }

  @media (max-width: 768px) {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1100;
    background: rgba(47, 59, 82, 0.8);
    padding: 10px;
    border-radius: 50%;
  }
`;

const Logo = styled.div`
  font-size: ${(props) => (props.isOpen ? "1.5em" : "1em")};
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  color: #D3D3D3;
  text-transform: uppercase;
  letter-spacing: 2px;
  overflow: hidden;
  white-space: nowrap;
  transition: font-size 0.3s ease-in-out;

  @media (max-width: 768px) {
    display: ${(props) => (props.isMobile ? "none" : "block")};
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  flex-grow: 1;
`;

const NavItem = styled.li`
  margin: 15px 0;
  cursor: pointer;
  font-size: 1.1em;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  white-space: nowrap;
  &:hover {
    background-color: #D3D3D3;
    color: white;
    transform: scale(1.05);
  }
  &:active {
    background-color: #a4a2a5;
  }
  & > span {
    display: ${(props) => (props.isOpen ? "inline" : props.isMobile ? "inline" : "none")};
    transition: display 0.3s ease-in-out;
  }
`;

const LogoutItem = styled(NavItem)`
  background: none;
  color: #D3D3D3;
  font-weight: bold;
  &:hover {
    background-color: #D3D3D3;
    color: white;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.isOpen && props.isMobile ? "block" : "none")};
`;

const handleLogout = () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "/login";
};

const UserSidebar = ({ setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <ToggleButton 
        onClick={toggleSidebar} 
        isOpen={isOpen}
        isMobile={isMobile}
      >
        <FontAwesomeIcon icon={isOpen && !isMobile ? faTimes : faBars} />
      </ToggleButton>
      
      <Overlay isOpen={isOpen} isMobile={isMobile} onClick={closeSidebar} />
      
      <SidebarContainer isOpen={isOpen} isMobile={isMobile}>
        {!isMobile && (
          <