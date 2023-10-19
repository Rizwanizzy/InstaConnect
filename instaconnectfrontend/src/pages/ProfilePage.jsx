import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import styled from 'styled-components';
import { useSelector,useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import userProfileApi from '../api/userProfileApi';
import { BASE_URL } from '../utils/constants';
import ProfileUpdateModal from '../components/ProfileUpdateModal';
import PostDetailModal from '../components/PostDetailModal';
import DisplayPicture from '../images/Default-Profile-Picture1.png'
import followUserApi from '../api/followUserApi';
import { toast } from 'react-toastify';
import { followUser, unfollowUser } from '../redux/slice';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import checkfollowstatusapi from '../api/checkfollowstatusapi';

const UserPage = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color:#f0f0f0;
  top:0;
  bottom:0;
  position:fixed;
`;

const ProfileContentWrapper = styled.div`
  width:100%;
  display: flex;
  flex-direction: column; /* Display children in a column */
  padding-left: 16.5%;
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
  }

  img:hover {
    opacity: 0.7;
  }
`;

const ProfileInfo = styled.div`
.name {
  font-size: 1.5em;
  margin-bottom: 0;
  font-weight: 600
}

.about {
  font-size: 1em;
  color: #545454;
}



.stats {
  margin-left: -17px;
}

.profile-content {
  margin-left: 1rem; /* Adjust the margin as needed */
}
`;

const CustomText = styled.span`
  font-weight: bold;
  font-size: 18px; 
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
`;


const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: baseline;
  justify-items: center;
`;

const ImagesWrapper = styled.div`
  margin-top: 2em; /* Adjust the margin as needed to create space between the profile and images */
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 30px; /* Increase margin-bottom to create space between images in the same column */
  margin-left: 0px; /* Decrease margin-left to reduce space between images in the same row */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img:hover {
    opacity: 0.7;
  }
`;

const ProfilePage = () => {

  const{ user , isAuthenticated,loading } =useSelector(state =>state.user)
  const [posts,setPosts] =useState([])
  const [postId,setPostId] =useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const [profile,setProfile] = useState(null)
  const [showProfileModal,setShowProfileModal] =useState(false)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)
  const [isFollowingLocal,setIsFollowingLocal] = useState(false)
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (isAuthenticated && profile && user) {
      const fetchFollowStatus = async () => {
        try {
          const response = await checkfollowstatusapi(profile.email)
          if (!response.error) {
            const { isFollowing } = response;
            setIsFollowingLocal(isFollowing);
          } else {
            // Handle the error case, e.g., show an error message
            console.log('Error checking follow status:', response.error);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchFollowStatus();
    }
  }, [profile]);


  if (!isAuthenticated &&  !loading && user === null){
    return <Navigate to='/' />
  }

  const handleViewPost = (postId) =>{
    setPostId(postId)
    setShowPostDetailModal(true)
    console.log('POstid',postId)
  }

  const handleToggleFollow = (userId) =>{
    try {
      const updatedProfile = { ...profile}

      if (isFollowingLocal) {
        updatedProfile.following_count-=1
        dispatch(unfollowUser(userId)).then(() => {
          setIsFollowingLocal(false)
          const localStorageKey = `following_${userId}`
          localStorage.setItem(localStorageKey,'false')
        })
      } else {
        updatedProfile.following_count+=1
        dispatch(followUser(userId)).then(() => {
          setIsFollowingLocal(true); // Update the state
          const localStorageKey = `following_${userId}`;
          localStorage.setItem(localStorageKey, 'true');
        });
      }

      setProfile(updatedProfile)
    } catch (error) {
      console.error(error)
    }
    
  }


  return (
    <UserPage>
      <NavContainer>
        <NavBar />
      </NavContainer>
      <ProfileContentWrapper>
        <ProfileContainer>
            <ProfileUpdateModal isVisible={showProfileModal} onClose={() =>setShowProfileModal(false)} />
            <PostDetailModal isVisible={showPostDetailModal} onClose={() =>setShowPostDetailModal(false)} postID={postId}/>
            <label htmlFor="profilePhotoInput">
              <ProfilePhoto>
                <img src={ 
                  user?.email === profile?.email?
                  user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture
                  : profile?.display_pic?`${BASE_URL}${profile.display_pic}` : DisplayPicture} alt="profile" />
              </ProfilePhoto>
            </label>
            <div className="profile-content">
              <UserName>
                <p className="name mr-5" style={{ fontWeight: 'bold', fontSize:'x-large', margin:'0px -3px'}}>{profile?.username ?? ""}</p>

                {user?.email !== profile?.email && (
                  isFollowingLocal ? (
                    <Button
                      className='mr-3'
                      type='button'
                      variant='outline-secondary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`Unfollow ${profile?.username}`}
                      onClick={() => handleToggleFollow(profile?.id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      className='mr-3'
                      type='button'
                      variant='outline-primary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`Follow ${profile?.username}`}
                      onClick={() => handleToggleFollow(profile?.id)}
                    >
                      Follow
                    </Button>
                  )
                )}

                {user?.email === profile?.email ?
                  <button className='btn btn-secondary w-20' onClick={() => user?.email === profile?.email && setShowProfileModal(true)}>Edit</button>
                  :
                  <button className='btn btn-primary' >Message</button>
                }
              </UserName>
              <div className="stats">
                <div className="flex" style={{marginLeft:'-20px'}}>
                  <div className="lg:mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-900">
                    </span>
                    <CustomText style={{ fontWeight: 'bold' }} className="text-sm text-blueGray-400">{profile?.total_posts ?? "0"}  Posts</CustomText>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-900">
                    </span>
                    <CustomText style={{ fontWeight: 'bold' }} className="text-sm text-blueGray-400"> {profile?.following_count ?? "0"}  Followers</CustomText>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-900">
                    </span>
                    <CustomText style={{ fontWeight: 'bold' }} className="text-sm text-blueGray-400">{profile?.follower_count ?? "0"} Following</CustomText>
                  </div>
                </div>
              </div>
              <p className="about">
                {user?.email === profile?.email
                  ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
                  : `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`}
              </p>
              <p className="about">{profile?.email ?? ""}</p>
            </div>
        </ProfileContainer>


        {/* <div className="mt-10 py-10 border-t border-blueGray-200 text-center"> */}
        <ImagesWrapper> {/* Wrap the ImagesContainer */}
          <ImagesContainer>
            {posts ? (
              posts.map((post) => (
                <ImageWrapper
                  key={post.id}
                  onClick={() => handleViewPost(post.id)}
                >
                  <img
                    src={`${BASE_URL}${post.img}`}
                    alt="post"
                  />
                </ImageWrapper>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </ImagesContainer>
        </ImagesWrapper> {/* End of ImagesContainer */}
        
      </ProfileContentWrapper>
    </UserPage>
  );
}

export default ProfilePage;
