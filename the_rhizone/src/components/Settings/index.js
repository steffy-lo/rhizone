import React from 'react';
import './styles.css';

class Settings extends React.Component {
  render () {
   return(
     <div class="container">
        <dl class="form">
          <label for="username">Change Username</label>
          <input type="text" id="username" placeholder="New username"/>
          <br/>
          <br/>
          <dt><label for="inputPassword">Update Password</label></dt>
          <div>
            <div>
              <input type="password" id="inputPassword"  placeholder="Current Password"/>
              <input type="password" id="inputPasswordNew" placeholder="New Password"/>
            </div>
          </div>
          <p><button id = "save-settings" type="click" class="btn btn-primary">Update Settings</button></p>
        </dl>
      </div>
   );
  }
}

export default Settings;
