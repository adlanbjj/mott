import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div>
       <form>
        <input type="text" placeholder='Enter your username' name='username' />
        <input type="email" placeholder='Enter your email' name='email' />
        <input type="password" placeholder='Enter your password' name='password' />
        <input type="text" placeholder='Yout location' name='location' />
        <button>Login</button>
      </form>
      <Link to="/login" className="header-link">
        Login
      </Link>
    </div>
  )
}

export default Register
