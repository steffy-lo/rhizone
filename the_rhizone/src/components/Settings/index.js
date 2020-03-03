import React from 'react';
import './styles.css';
import { Link, Redirect } from "react-router-dom";
import * as Data from './../../data/hardcoded.js';
import ls from 'local-storage';
import Login from '../Login';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.state.username,
      loggedIn: props.state.loggedIn
    };
    this.updateSettings = this.updateSettings.bind(this);
    this.updateRights = this.updateRights.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  componentWillMount() {
    if (ls.get('loggedIn') !== undefined) {
      this.setState({
        username: ls.get('username'),
        loggedIn: ls.get('loggedIn')
      });
    }
  }

  deleteAccount(e) {
    const username = document.querySelector('#usernameDel').value;
    const del = document.querySelector('.deleteAccount');
    if (del.lastChild.className === "msg") {
      del.removeChild(del.lastChild)
    }
    let msg = document.createElement('p');
    msg.className = "msg";
    if (Data.userData.get(username) === undefined) { // get from database
      msg.appendChild(document.createTextNode("User doesn't exist!"));
      msg.style.color = "red";
      del.appendChild(msg);
    } else {
      msg.appendChild(document.createTextNode("Account has been successfully deleted!"));
      msg.style.color = "green";
      del.appendChild(msg);
      Data.userData.delete(username) // delete from database
    }

  }

  createAccount(e) {
    e.preventDefault();
    const username = document.querySelector('#usernameCreate').value;
    const password = document.querySelector('#passwordCreate').value;
    const create = document.querySelector('.createAccount');
    if (create.lastChild.className === "msg") {
      create.removeChild(create.lastChild)
    }
    let msg = document.createElement('p');
    msg.className = "msg";
    if (Data.userData.get(username) === undefined) { // get from database
      msg.appendChild(document.createTextNode('Account successfully created!'));
      msg.style.color = "green";
      create.appendChild(msg);
      Data.userData.set(username, {password: password, isAdmin: false}) // add to database
    } else {
      msg.appendChild(document.createTextNode('Account already exists!'));
      msg.style.color = "red";
      create.appendChild(msg);
    }
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
    if (this.state.loggedIn) {
      let adminView;
      const user = this.state.username;
      if (Data.userData.get(user).isAdmin) {
          adminView =
              <dl className="form">
                <label>Allow Admin Rights</label>
                <input type="text" id="username" placeholder="Username"/>
                <p><button id="give-admin-rights" type="click" onClick={this.updateRights}>Allow</button></p>
                <br/>
                <div className="createAccount">
                  <label>Create User Account</label>
                  <input type="text" id="usernameCreate" placeholder="Username"/>
                  <input type="text" id="passwordCreate" placeholder="Password"/>
                  <p><button id="create-account" type="click" onClick={this.createAccount}>Create</button></p>
                </div>
                <br/>
                <div className="deleteAccount">
                  <label>Delete User Account</label>
                  <input type="text" id="usernameDel" placeholder="Username"/>
                  <p><button id="create-account" type="click" onClick={this.deleteAccount}>Delete</button></p>
                </div>
              </dl>;
      }
      return(
        <div>
          <div className="LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/">Logout</Link></div>	
          <div className="Home" ><Link to="/">Home</Link></div>
          <div className="LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
          <div className="main">
            <dl className="form">
              <label htmlFor="inputPassword">Update Password</label>
              <div>
                <div>
                  <input type="password" id="inputPassword"  placeholder="Current Password"/>
                  <input type="password" id="inputPasswordNew" placeholder="New Password"/>
                </div>
              </div>
              <p><button id="save-settings" type="click" onClick={this.updateSettings}>Update Settings</button></p>
            </dl>
            {adminView}
          </div>
        </div>
      );
    } else {
      return (<Redirect to = {'/login'} />);
    }
  }
}

export default Settings;
