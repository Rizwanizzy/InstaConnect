import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import postListApi from '../api/postListApi'
import { toast } from 'react-toastify';
import deletePostApi from '../api/deletePostApi'
import PostModal from '../components/PostModal';
import { BASE_URL } from '../utils/constants';
import { NavLink } from 'react-router-dom';
import DropdownOptions from '../components/DropdownOptions';
import PostDetailModal from '../components/PostDetailModal';
import Loading from '../components/Loading'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color: #f0f0f0;
  position:fixed;
  top:0;
  bottom:0;
`;

const ContentContainer = styled.div`
  width:100%;
  flex-direction:column;
  flex-grow: 1;
  padding: 20px;
  padding-left:16.5%;
  height:100%;
`;

const HomePage = () => {

  const [showPostModal,setShowPostModal] = useState(false)
  const [showPostDetailModal,setShowPostDetailModal] = useState(false)
  const [posts,setPosts] = useState([])
  const [postId,setPostId] = useState()
  const [initialCaption, setInitialCaption] = useState('');
  const [initialImage, setInitialImage] = useState(null);
  const { loading , isAuthenticated,user } = useSelector(state =>state.user)

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const data = await postListApi()
        setPosts(data)
      } catch (error) {
        console.error(error)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user,showPostModal,showPostDetailModal])

  const fetchData = async () =>{
    try {
      const data =await postListApi()
      setPosts([])
      setPosts(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePost = async (postId) =>{
    try {
      await deletePostApi(postId,fetchData)
      toast.success('Post Deleted Successfully.',{
        position:'top-center',
      })
    } catch (error) {
      toast.error('Post Not Deleted.',{
        position:'top-center',
      })
    }
  }

  const handleUpdatePost = (postId) =>{
    setPostId(postId)

    const postToUpdate = posts.find((post) => post.id === postId)
    if (postToUpdate) {
      setInitialCaption(postToUpdate.body)
      setInitialImage(postToUpdate.img)
    }
    setShowPostModal(true)
  }

  const handleReportPost = async (postId) => {
    try {

    } catch (err) {

    }
  };

  const toggleLikePost = async (postId) => {
    try {
      
    } catch (error) {
      
    }
  };

  const handleToggleFollow = async (userId)=>{
    try{

    }
    catch(error){

    }
  };

  if(!isAuthenticated && !loading && user === null){
    return <Navigate to='/' />
  }

  const closePostModal = () =>{
    setShowPostModal(false)
    setShowPostDetailModal(false)
  }

  const showPostDetail = (postId) =>{
    setPostId(postId)
    setShowPostDetailModal(true)
  }

  return (
    <PageContainer>
      <NavContainer>
        <NavBar />
      </NavContainer>
      {loading?(
          <Loading />
        ):(
      <ContentContainer>
        <PostModal isVisible={showPostModal} onClose={closePostModal} postID={postId} initialCaption={initialCaption} initialImage={initialImage} />
        <PostDetailModal isVisible={showPostDetailModal} onClose={closePostModal} postID={postId} />
        <div className="mt-10">
        {posts ? posts.map((post)=>(
        <div key={post.id} className="block rounded-lg w-11/12 lg:w-4/6 min-w-min mx-auto mt-3 gap-4 p-2 text-[#252525] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
          <div
            className="relative overflow-hidden bg-cover bg-no-repeat"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            <div className="flex justify-between items-center border-b-2  border-gray-100">
              <div className="flex items-center ">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`${BASE_URL}${post.author.display_pic}`}
                  alt="user_image"
                />
                <NavLink to={`/profile/${post.author.email}`} className="mb-2 ms-2 mt-2 text-md font-bold cursor-pointer leading-tight text-[#262626] text-decoration-none" >
                  {post.author.username}
                </NavLink>
                  {post.author.email !== user.email &&
                  (post.followers && post.followers.some(
                    (follower) => follower.follower === user.email
                  ) ? (
                  <button type='button'
                  className='inline-block bg-transparent justify-start leading-normal'
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  title={`unfollow ${post.author.username}`}
                  onClick={() => handleToggleFollow(post.author.id)}
                  >
                    <span className='text-blue-500 text-sm font-medium p-2 font-mono'>Unfollow</span>
                  </button>
                  ):(
                  <button type='button'
                  className='inline-block bg-transparent justify-start leading-normal'
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  title={`follow ${post.author.username}`}
                  onClick={() => handleToggleFollow(post.author.id)}
                  >
                    <span className='text-blue-500 text-sm font-medium p-2 font-mono'>Follow</span>
                  </button>
                  ))}
                  
                  <span className='font-xs font-mono font-extralight ml-2 text-sm text-gray-400'> {post.created_time} ago</span>
                
                
              </div>
              <DropdownOptions post={post} handleDeletePost={handleDeletePost} handleUpdatePost={handleUpdatePost} handleReportPost={handleReportPost} />
            </div>
            <div className='border-b-2  border-gray-100'>
              <img
                className="rounded-lg mx-auto my-3 h-96 border-2"
                src={`${BASE_URL}${post.img}`}
                alt="post_image"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-row gap-4">
            {post.likes.includes(user.id)?(
              <button
              className='inline-block p-0 text-xs font-medium leading-normal'
              type='button'
              data-te-ripple-init
              data-te-ripple-color='light'
              onClick={()=>{toggleLikePost(post.id, true)}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28"><path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" style={{ fill: 'red' }}/></svg>

              </button>
            ):(
              <button
              className='inline-block p-0 text-xs font-medium leading-normal'
              type='button'
              data-te-ripple-init
              data-te-ripple-color='light'
              onClick={()=>{toggleLikePost(post.id, true)}}>
                <span className="material-symbols-outlined" ><FavoriteBorderIcon /></span>
              </button>
            )}
            <button
              className='inline-block p-0 text-xs font-medium leading-normal'
              type='button'
              data-te-ripple-init
              data-te-ripple-color='light'
              onClick={()=>{showPostDetail(post.id)}}>
                <span className="material-symbols-outlined"><ChatBubbleOutlineIcon /></span>
              </button>
            </div>
            <p>{post.likes_count ?? 0}&nbsp;likes</p>
            <div>
              <p className="text-left  font-normal mb-4 text-md">
                <span className="inline mr-2 font-semibold">{post.author.username}</span>{post.body}
              </p>
            </div>
          </div>
        </div>
        )):<h1 className='flex justify-center align-middle'>Nothing to show here..!</h1>}
      </div>
      
      </ContentContainer>
      )}
    </PageContainer>
  );
}

export default HomePage;
