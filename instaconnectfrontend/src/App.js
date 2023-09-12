import './App.css';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLogin from './pages/AdminLogin';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './redux/slice'


function App() {

  const dispatch = useDispatch()

  useEffect(() =>{
    dispatch(checkAuth())
  },[dispatch])
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/admin-login' element={<AdminLogin/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
