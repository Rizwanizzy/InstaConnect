import React, { useState } from 'react'
// import './NavBar.css'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material'
import profileIcon from '../images/Default-Profile-Picture1.png'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slice';

const NavBarWrapper = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
`;

const Logo = styled.span`
  font-family: "Style Script";
  font-size: 33px;
  margin: 25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(0, 0, 0);
  background: 0;
  border: 0;
  margin: 5px 15px 5px 15px;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  width: 100%;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
    text-decoration: none !important; /* Add !important to increase specificity */
  }
`;

const AvatarContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  margin: 5px 15px 5px 15px;
  padding: 10px 15px 10px 10px;
  color: rgb(0, 0, 0);

  img {
    width: 100%;
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
    text-decoration: none !important; /* Add !important to increase specificity */
  }
`

const LogoutButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(0, 0, 0);
  background: 0;
  border: 0;
  margin: 5px 15px 5px 15px;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  width: 100%;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
    text-decoration: none !important; /* Add !important to increase specificity */
  }
`;

const MoreButton = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(0, 0, 0);
  background: 0;
  border: 0;
  margin: 5px 15px 5px 15px;
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  width: 100%;
  position: fixed;
  bottom: 3px;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.128);
    text-decoration: none;
  }
`;

// import Create from './navigateTo/Create';
const NavBar = () => {
    const [show,setShow] = useState(false)
    const {user,isAuthenticated} = useSelector(state => state.user)
    const dispatch = useDispatch()

    const email = isAuthenticated ? user?.email:''

    const handleLogout = () =>{
        dispatch(logout())
    }
  return (
    <NavBarWrapper>
      <Logo>Instaconnect</Logo>
      <ButtonContainer>
        <NavButton to="/">
          <HomeIcon />
          <span>Home</span>
        </NavButton>
        <NavButton to="#">
          <SearchIcon />
          <span>Search</span>
        </NavButton>
        <NavButton to="#">
          <ExploreIcon />
          <span>Explore</span>
        </NavButton>
        <NavButton to="#">
          <ChatIcon />
          <span>Messages</span>
        </NavButton>
        <NavButton to="#">
          <FavoriteIcon />
          <span>Notification</span>
        </NavButton>
        <NavButton to="#">
          <AddCircleIcon />
          <span>Create</span>
        </NavButton>
        <AvatarContainer to={`/profile/${email}`}>
          <Avatar className="avatar">
            <img src={profileIcon} alt="" />
          </Avatar>
          <span>Profile</span>
        </AvatarContainer>
        <LogoutButton onClick={handleLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </LogoutButton>
        <MoreButton to="#">
            <MenuIcon />
            <span>More</span>
        </MoreButton>
      </ButtonContainer>
        
    </NavBarWrapper>
    
  )
}

export default NavBar