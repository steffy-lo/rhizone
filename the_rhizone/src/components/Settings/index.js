import React from 'react';
import './styles.css';
import { Link } from "react-router-dom";

class Settings extends React.Component {
  render () {
   return(
    <div>
    <div className = "LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/login">Logout</Link></div>	
    <div className = "Home" ><Link to="/">Home</Link></div>
    <div className = "LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
      <div className="main">
        <dl className="form">
          <label htmlFor="username">Change Username</label>
          <input type="text" id="username" placeholder="New username"/>
          <br/>
          <br/>
          <label htmlFor="inputPassword">Update Password</label>
          <div>
            <div>
              <input type="password" id="inputPassword"  placeholder="Current Password"/>
              <input type="password" id="inputPasswordNew" placeholder="New Password"/>
            </div>
          </div>
          <p><button id = "save-settings" type="click">Update Settings</button></p>
        </dl>
      </div>
    </div>
   );
  }
}

export default Settings;
