import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import {Link,Navigate} from 'react-router-dom'
import {register} from '../redux/slice'
import appStores from '../images/appstore.png'
import loginImage1 from '../images/network.jpg'
import '../assets/css/fonts.css'
import 'bootstrap/dist/css/bootstrap.min.css';



const RegisterPage = () => {

    const dispatch = useDispatch()
    const {registered,loading} =useSelector(state => state.user)
    const [formData,setFormData] = useState({
        username:'',
        email:'',
        password:'',
        password1:''
    })
    const {email,username,password,password1} = formData

    const onchange = (e) =>{
        setFormData({ ...formData, [e.target.name] : e.target.value})
    }

    const userRegister = async(e) =>{
        e.preventDefault()
        if(password===password1){
            dispatch(register({username,email,password}))
        }else{
            toast.error("Password mis-match")
        }
    }

    if(registered) return <Navigate to='/' />
  return (
    <div className="container">
      <div className="row mt-5">
        <h2 className="font-script">Instaconnect</h2>
        <div className="col-md-6 mt-2">
          <img src={loginImage1} alt="login Image" className="img-fluid" />
        </div>
        
        <div className="col-md-6 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            
            <form onSubmit={userRegister} className="mt-4 " style={{width:'60%'}}>
              <div className="mb-3">
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={onchange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={onchange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={onchange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  id="password1"
                  name="password1"
                  placeholder="Confirm Password"
                  type="password"
                  value={password1}
                  onChange={onchange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Sign up
              </button>
            </form>
            <div className="mt-4">
              Already have an account?
              <Link to="/" style={{ textDecoration: 'none', color: '#0095F6' }}>
                {' '}
                Login
              </Link>
            </div>
            <div className="mt-4">
              <p>Get the app.</p>
              <img
                src={appStores}
                alt="Get the app"
                style={{ width: '300px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage
