import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <form>
        <input type="text" placeholder='Enter your username' name='username' />
        <input type="password" placeholder='Enter your password' name='password' />
        <button>Login</button>
      </form>
      <Link to="/register" className="header-link">
        Register
      </Link>
    </div>
  )
}

export default Login
