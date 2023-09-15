import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import styled from 'styled-components';
import DefaultPicture from '../images/default_picture.png';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import userProfileApi from '../api/userProfileApi';
import { BASE_URL } from '../utils/constants';

const UserPage = styled.div`
  display: flex;
  height: 100vh;
  padding-right:10rem;
`;

const NavContainer = styled.div`
  width: 250px;
  background-color: #f0f0f0;
`;

const ProfileContainer = styled.div`
  margin: 0;
  flex: 0.8;
  display: grid;
  grid-template-columns: 1fr 2fr;
  font-family: Arial, Helvetica, sans-serif;
  padding: 0em 0em 2em 5em;
  margin-top: 4em;
  margin-bottom: 2em;
`;

const ProfileInput = styled.input`
  display: none;
`;

const ProfilePhoto = styled.div`
  background: #000;
  width: 10em;
  height: 10em;
  border-radius: 50%;
  margin-top: 0.5em;
  margin-left: 100px;

  @media screen and (max-width: 600px) {
    width: 5em;
    height: 5em;
    margin-top: 3em;
    margin-right: 2em;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
  }

  img:hover {
    opacity: 0.7;
  }
`;

const ProfileInfo = styled.div`
.name {
  font-size: 1.2em;
  color: #545454;
  margin-bottom: 0;
}

.about {
  margin-top: 1rem;
  font-size: 1em;
  color: #545454;
}

button {
  background-color: #0095f6;
  color: #fff;
  font-size: 1.1em;
  width: 6em;
  height: 2em;

  &:hover {
    background-color: #0081d6;
  }
}

.stats {
  margin-left:-17px;
}

.profile-content {
  margin-left: 1rem; /* Adjust the margin as needed */
}
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
`;

const EditButton = styled.button`
  margin-top: 23px;
  margin-left: 10px;
  cursor: pointer;
`;


const ProfilePage = () => {

  const{ user , isAuthenticated,loading } =useSelector(state =>state.user)
  const [posts,setPosts] =useState([])
  const [postId,setPostId] =useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const [profile,setProfile] = useState(null)
  const [showProfileModal,setShowProfileModal] =useState(false)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)

  const param = useParams()
  const email = param.email

  useEffect(() =>{

    const fetchData = async () =>{
      try {
        setIsLoading(true)
        const data = await userProfileApi(email)
        if (data && data.profile_user){
          setProfile(data.profile_user)
          setPosts(data.profile_posts)
          setIsLoading(false)
        } else{
          console.error('Profile data is undefined')
          setIsLoading(false)
        }
        
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  },[email,showPostDetailModal])

  if (!isAuthenticated &&  !loading && user === null){
    return <Navigate to='/' />
  }


  return (
    <UserPage>
      <NavContainer>
        <NavBar />
      </NavContainer>
      <ProfileContainer>
        <ProfileInput type="file" accept="image/*" name="photo" id="profilePhotoInput" />
        <label htmlFor="profilePhotoInput">
          <ProfilePhoto role='button' title='Click to edit photo'>
            <img src={`${BASE_URL}${profile?.display_pic}`} alt="profile" />
            {profile?.email === user?.email ?(
              <span onClick={() => setShowProfileModal(true)}>Edit</span>
            ):''}
          </ProfilePhoto>
        </label>
        <ProfileInfo>
          <div className="profile-content"> {/* Wrap the entire content */}
            <UserName>
              <p className="name">{profile?.username?? ""}</p>
            </UserName>
            <div className="stats">
              <div className="flex">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  </span>
                  <span className="text-sm text-blueGray-400">0  Followers</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">

                  </span>
                  <span className="text-sm text-blueGray-400">0  Following</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">

                  </span>
                  <span className="text-sm text-blueGray-400">0  Posts</span>
                </div>
              </div>
            </div>
            <p className="about">Full Name</p>
            <p className="about">User About</p>
          </div>
        </ProfileInfo>


      </ProfileContainer>
    </UserPage>
  );
}

export default ProfilePage;
