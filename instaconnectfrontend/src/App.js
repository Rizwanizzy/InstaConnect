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
          <Route path='/profile/:email' element={<ProfilePage />}/>
        </Routes>
      </Router>
  );
}

export default App;
