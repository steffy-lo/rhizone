import React from 'react';
import './styles.css';
import { Link, Redirect } from "react-router-dom";
import * as Data from './../../data/hardcoded.js';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.updateSettings = this.updateSettings.bind(this);
    this.updateRights = this.updateRights.bind(this);
  }

  updateSettings() {
    const inputCurrPassword = document.querySelector('#inputPassword').value;
    const updateMsg = document.createElement('p');
    updateMsg.className = "update";
    const form = document.querySelector('.form');
    if (form.lastChild.className === "update") {
      form.removeChild(form.lastChild)
    }
    if (inputCurrPassword === Data.userData.get(this.props.state.username).password) {
      const newPassword = document.querySelector('#inputPasswordNew').value;
      Data.userData.get(this.props.state.username).password = newPassword;
      updateMsg.appendChild(document.createTextNode('Your password has been updated successfully!'));
      updateMsg.style.color = "green";
      form.appendChild(updateMsg);
    } else {
      updateMsg.appendChild(document.createTextNode('The entered current password is wrong! Please try again.'));
      updateMsg.style.color = "red";
      form.appendChild(updateMsg);
    }
  }

  updateRights() {
    const user = document.querySelector('#username').value;
    const form = document.querySelector('.admin');
    if (form.lastChild.className === 'givingRightsMsg') {
      form.removeChild(form.lastChild);
    }
    const givingRightsMsg = document.createElement('p');
    givingRightsMsg.className = 'givingRightsMsg';
    if (Data.userData.get(user) === undefined) {
      givingRightsMsg.appendChild(document.createTextNode("The user doesn't exist!"));
      givingRightsMsg.style.color = "red";
      form.appendChild(givingRightsMsg);
    } else {
      Data.userData.get(user).isAdmin = true;
      givingRightsMsg.appendChild(document.createTextNode(user + " has been given admin rights"));
      givingRightsMsg.style.color = "green";
      form.appendChild(givingRightsMsg);
    }
  }

  render () {
    if (this.props.state.loggedIn) {
      let adminView;
      const user = this.props.state.username;
      if (Data.userData.get(user).isAdmin) {
          adminView = 
          <div className="admin">
            <label htmlFor="username">Allow Admin Rights</label>
            <input type="text" id="username" placeholder="Username"/>
            <p><button id="give-admin-rights" type="click" onClick={this.updateRights}>Allow</button></p>
          </div>;
      }
      return(
        <div>
          <div className="LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/login">Logout</Link></div>	
          <div className="Home" ><Link to="/">Home</Link></div>
          <div className="LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
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
              <p><button id="save-settings" type="click" onClick={this.updateSettings}>Update Settings</button></p>
            </dl>
          </div>
        </div>
      );
    } else {
      return (<Redirect to = {'/'} />);
    }
  }
}

export default Settings;
