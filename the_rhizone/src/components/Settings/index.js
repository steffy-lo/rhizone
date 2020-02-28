import React from 'react';
import './styles.css';

class Settings extends React.Component {
  render () {
   return(
      <div className="root">
        <h1><a href="/">The RhiZone</a></h1>
        <a href="/inbox">Inbox</a>
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
   );
  }
}

export default Settings;
