import './App.css';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLogin from './pages/AdminLogin';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './redux/slice'
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import UsersList from './pages/UsersList';
import ReportedPostsList from './pages/ReportedPostsList';
import PostsLists from './pages/PostsLists';
import ExplorePage from './pages/ExplorePage';


function App() {

  const dispatch = useDispatch()

  useEffect(() =>{
    dispatch(checkAuth())
  },[dispatch])
  
  return (
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/admin-login' element={<AdminLogin/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/explore' element={<ExplorePage/>}/>
          <Route path='/profile/:email' element={<ProfilePage />}/>

          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/users' element={<UsersList />} />
          <Route path='/posts-lists' element={<PostsLists />} />

          <Route path='/reported-posts' element={<ReportedPostsList />} />
        </Routes>
      </Router>
  );
}

export default App;
