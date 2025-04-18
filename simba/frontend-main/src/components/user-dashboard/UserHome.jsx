import React from "react";
import styled, { keyframes } from "styled-components";
import { device } from "../../utils/mediaQueries";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: white;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;

  @media ${device.mobile} {
    padding: 15px;
    min-height: calc(100vh - 120px);
  }
`;

const WelcomeSection = styled.div`
  max-width: 700px;
  width: 100%;
  padding: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 1.2s ease-in-out;

  @media ${device.tablet} {
    padding: 30px;
  }

  @media ${device.mobile} {
    padding: 20px;
    backdrop-filter: blur(8px);
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 15px;

  @media ${device.tablet} {
    font-size: 2.2rem;
  }

  @media ${device.mobile} {
    font-size: 1.8rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 30px;

  @media ${device.tablet} {
    font-size: 1.1rem;
  }

  @media ${device.mobile} {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media ${device.mobile} {
    flex-direction: column;
    gap: 10px;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome to Shift Schedule Manager</WelcomeTitle>
        <WelcomeSubtitle>
          Easily manage shift schedules for employees, team leaders, and administrators.
          Optimize workforce management with our intuitive scheduling tool.
        </WelcomeSubtitle>
      </WelcomeSection>
    </HomeContainer>
  );
};

export default Home;