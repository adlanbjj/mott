import React from 'react'
import './Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';


const Sidebar = () => {
  return (
    <div className='sidebar-container'>
      <div className="sidebar-up-block">
          <button>Add post</button>
          <button>Edit profil</button>
      </div>
      <div className="sidebar-midle-block">
          <a href="#">Homepage</a>
          <a href="#">Words</a>
          <a href="#">Keyboard</a>
          <a href="#">Best users</a>
          <a href="#">Messages</a>
      </div>
      <div className="sidebar-bottom-block">
      <button>Logout</button>
      <FontAwesomeIcon icon={faUser} />
      <FontAwesomeIcon icon={faEnvelope} />

      </div>
    </div>
  )
}

export default Sidebar
