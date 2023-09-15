import React from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 250px;
  background-color: #f0f0f0;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const HomePage = () => {

  const { loading , isAuthenticated,user } = useSelector(state =>state.user)

  if(!isAuthenticated && !loading && user === null){
    return <Navigate to='/' />
  }
  return (
    <PageContainer>
      <NavContainer>
        <NavBar />
      </NavContainer>
      <ContentContainer>
        <h1>Home Page</h1>
      </ContentContainer>
    </PageContainer>
  );
}

export default HomePage;
