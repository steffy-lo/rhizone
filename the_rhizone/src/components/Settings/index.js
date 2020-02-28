import React from 'react';
import './styles.css';
import { Link } from "react-router-dom";
import * as Data from './../../data/hardcoded.js';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  render () {
    let adminView;
    const user = this.props.state.username;
    if (Data.userData.get(user).isAdmin) {
        adminView = 
        <div>
          <label htmlFor="username">Give Admin Rights</label>
          <input type="text" id="username" placeholder="Username"/>
          <br/>
          <br/>
        </div>;
    }
   return(
    <div>
    <div className = "LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/login">Logout</Link></div>	
    <div className = "Home" ><Link to="/">Home</Link></div>
    <div className = "LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
      <div className="main">
        <dl className="form">
          {adminView}
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
