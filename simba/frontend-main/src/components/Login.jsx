import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { device } from "../utils/mediaQueries"; // Make sure to import your media queries

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  animation: ${fadeIn} 0.8s ease-in-out;
  padding: 20px;
  box-sizing: border-box;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media ${device.mobile} {
    padding: 1.5rem;
    margin: 0 10px;
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 1s ease-in-out;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  @media ${device.mobile} {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 600;

  @media ${device.mobile} {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: rgb(53, 69, 98);
    box-shadow: 0 0 6px rgba(53, 69, 98, 0.5);
  }

  @media ${device.mobile} {
    padding: 0.65rem;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: white;
  background-color: rgb(53, 69, 98);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: rgb(33, 50, 78);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media ${device.mobile} {
    padding: 0.65rem;
    font-size: 0.95rem;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  background-color: #fadbd8;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;

  @media ${device.mobile} {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.75rem;

  @media ${device.mobile} {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        emailaddress: email,
        password,
      });
      
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        const dashboardPath = response.data.user.role === 'Admin' 
          ? "/admin-dashboard" 
          : "/user-dashboard";
        
        navigate(dashboardPath);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormContent>
          <Title>Hospital Staff Login</Title>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <form onSubmit={handleLogin}>
            <InputField>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </InputField>
            
            <InputField>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputField>
            
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : "Login"}
            </Button>
          </form>
        </FormContent>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;