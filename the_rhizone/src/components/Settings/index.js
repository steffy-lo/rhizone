import React from 'react';
import './styles.css';
import { Link, Redirect } from "react-router-dom";
import * as Data from './../../data/hardcoded.js';
import ls from 'local-storage';
import Button from "@material-ui/core/Button";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.state.user,
      loggedIn: props.state.loggedIn
    };
    this.updateSettings = this.updateSettings.bind(this);
    this.updateRights = this.updateRights.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.addUser = this.addUser.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentWillMount() {
    if (ls.get('loggedIn') !== undefined) {
      this.setState({
        user: ls.get('user'),
        loggedIn: ls.get('loggedIn')
      });
    }
  }

    deleteInbox(user) {
        console.log('deleting inbox data');
        const customUrl = '/inboxes/?userName=' + user
        // Create our request constructor with all the parameters we need
        const request = new Request( customUrl, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then( res => {
            // Handle response we get from the API.
            if (res.status === 200) {
                // user found
                console.log('user inbox deleted')
            } else {
                console.log('Failed to delete inbox data with userName:' + user)
                return null;
            }
        }).catch((error) => {
            console.log(error)
        })
    }

  deleteAccount(e) {
    const username = document.querySelector('#usernameDel').value;
    const del = document.querySelector('.deleteAccount');
    let msg = document.createElement('p');
    msg.className = "msg";
    const url = '/users/delete/' + username;

    const request = new Request(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    const component = this;

    fetch(request)
        .then(res => {
          if (del.lastChild.className === "msg") {
            del.removeChild(del.lastChild)
          }
          if (res.status === 200) {
            component.deleteInbox(username);
            msg.appendChild(document.createTextNode("Account has been successfully deleted!"));
            msg.style.color = "green";
            del.appendChild(msg);
          } else if (res.status === 404) {
            msg.appendChild(document.createTextNode("User doesn't exist!"));
            msg.style.color = "red";
            del.appendChild(msg);
          }
        }).catch((error) => {
      console.log(error)
    });

  }

  addInbox(user){
    console.log("adding inbox data");
    const url = '/inboxes';
    const data = {
        userName: user,
        newActivity: new Array(),
        oldActivity: new Array(),
        pastPosts: new Array()
    }
    const request = new Request( url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    // Send the request with fetch()
    fetch(request)
    .then( res => {
        // Handle response we get from the API.
        if (res.status === 200) {
            // user found
            console.log('user inbox added')
            return res.json();
        } else {
            console.log('Failed to add user inbox')
            return null;
        }
    }).catch((error) => {
        console.log(error)
    })

  }

  addUser(username, password) {
    // the URL for the request
    const url = '/add_user';

    // The data we are going to send in our request
    let data = {
      username: username,
      password: password,
      isAdmin: false
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    const component = this;

    // Send the request with fetch()
    fetch(request)
        .then(function(res) {

          // Handle response we get from the API.
          // Usually check the error codes to see what happened.
          const create = document.querySelector('.createAccount');
          const msg = document.createElement('p');
          msg.className = 'msg';
          if (create.lastChild.className === "msg") {
            create.removeChild(create.lastChild)
          }
          if (res.status === 200) {
            console.log(res);
            component.addInbox(data.username);
            msg.appendChild(document.createTextNode('Account successfully created!'));
            msg.style.color = "green";
            create.appendChild(msg);
          } else {
            // If server couldn't add the student, tell the user.
            // Here we are adding a generic message, but you could be more specific in your app.
            msg.appendChild(document.createTextNode('Could not add user.'));
            msg.style.color = "red";
            create.appendChild(msg);
          }
        }).catch((error) => {
      console.log(error)
    })
  }

  createAccount(e) {
    e.preventDefault();
    const component = this;
    const username = document.querySelector('#usernameCreate').value;
    const password = document.querySelector('#passwordCreate').value;
    const create = document.querySelector('.createAccount');
    let msg = document.createElement('p');
    msg.className = "msg";
    const url = '/users/?userName=' + username

    fetch(url)
        .then(function(res) {
          if (create.lastChild.className === "msg") {
            create.removeChild(create.lastChild)
          }
          if (res.status === 200) {
            msg.appendChild(document.createTextNode('Account already exists!'));
            msg.style.color = "red";
            create.appendChild(msg);
          } else if (res.status === 404) {
            console.log("add to database");
            // add to database
            component.addUser(username, password)
          }
        }).catch((error) => {
      console.log(error)
    });
  }

  updatePassword(password) {
    const url = '/users';

    let data = {
      username: this.state.user.userName,
      password: password,
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    fetch(request)
        .then(function(res) {
          const updateMsg = document.createElement('p');
          updateMsg.className = "update";
          const form = document.querySelector('.form');
          if (form.lastChild.className === "update") {
            form.removeChild(form.lastChild)
          }
          if (res.status === 200) {
            updateMsg.appendChild(document.createTextNode('Your password has been updated successfully!'));
            updateMsg.style.color = "green";
            form.appendChild(updateMsg);
          } else {
            updateMsg.appendChild(document.createTextNode('Could not update password.'));
            updateMsg.style.color = "red";
            form.appendChild(updateMsg);
          }
        }).catch((error) => {
      console.log(error)
    });
  }

  updateSettings() {
    const inputCurrPassword = document.querySelector('#inputPassword').value;
    const updateMsg = document.createElement('p');
    updateMsg.className = "update";
    const form = document.querySelector('.form');
    const url = '/users/login';

    // The data we are going to send in our request
    let data = {
      userName: this.state.user.userName,
      password: inputCurrPassword
    };

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data);
          const newPassword = document.querySelector('#inputPasswordNew').value;
          this.updatePassword(newPassword)
        })
        .catch((error) => {
          console.log(error);
          if (form.lastChild.className === "update") {
            form.removeChild(form.lastChild)
          }
          updateMsg.appendChild(document.createTextNode('The entered current password is wrong! Please try again.'));
          updateMsg.style.color = "red";
          form.appendChild(updateMsg);
        });
  }

  updateRights() {
    const user = document.querySelector('#username').value;
    const form = document.querySelector('.admin');
    const givingRightsMsg = document.createElement('p');
    givingRightsMsg.className = 'msg';

    const url = '/users/privileges/' + user;

    const request = new Request(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    fetch(request)
        .then(function(res) {
          if (form.lastChild.className === 'msg') {
            form.removeChild(form.lastChild);
          }
          if (res.status === 200) {
            givingRightsMsg.appendChild(document.createTextNode(user + " has been given admin rights"));
            givingRightsMsg.style.color = "green";
            form.appendChild(givingRightsMsg);
          } else {
            givingRightsMsg.appendChild(document.createTextNode("The user doesn't exist!"));
            givingRightsMsg.style.color = "red";
            form.appendChild(givingRightsMsg);
          }
        }).catch((error) => {
      console.log(error)
    });
  }

  render () {
    if (this.state.loggedIn) {
      let adminView;
      const user = this.state.user;
      if (user.isAdmin) {
          adminView =
              <dl className="form">
                <div className="admin">
                  <label>Allow Admin Rights</label>
                  <input type="text" id="username" placeholder="Username"/>
                  <p><button id="give-admin-rights" type="click" onClick={this.updateRights}>Allow</button></p>
                </div>
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
          <div className="buttons">
          <div className="LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/">
            <Button>Logout</Button>
            </Link>
          </div>	
          <div className="LinkMeInbox" >
            <Link to="/inbox">
              <Button>Inbox</Button>
            </Link>
          </div>
          <div className="LinkMeHome" >
            <Link to="/">
              <Button>Home</Button>
            </Link>
          </div>
          </div>
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
