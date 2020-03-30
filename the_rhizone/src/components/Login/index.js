import React from 'react';
import './styles.css';
import { Redirect} from 'react-router-dom';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    const component = this;
    const form = document.querySelector('.form');
    if (form.lastChild.className === "loginError" || form.lastChild.className === "createMsg") {
      form.removeChild(form.lastChild)
    }
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const url = '/users/login';

    // The data we are going to send in our request
    let data = {
      userName: username,
      password: password
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
            component.props.login(true, data);
        })
        .catch((error) => {
            console.log(error);
            if (document.querySelector('.loginError') == null) {
                let pElement = document.createElement('p');
                pElement.className = 'loginError';
                pElement.appendChild(document.createTextNode('Incorrect username or password.'));
                pElement.style.color = "red";
                form.appendChild(pElement);
            }
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

  // A function to send a POST request to add a new user
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
          const form = document.querySelector('.form');
          const createMsg = document.createElement('p');
          createMsg.className = 'createMsg';
          if (res.status === 200) {
            component.addInbox(data.username);
            createMsg.appendChild(document.createTextNode('Account successfully created!'));
            createMsg.style.color = "green";
            form.appendChild(createMsg);
          } else {
            // If server couldn't add the student, tell the user.
            // Here we are adding a generic message, but you could be more specific in your app.
            createMsg.appendChild(document.createTextNode('Could not add user.'));
            createMsg.style.color = "red";
            form.appendChild(createMsg);
          }
        }).catch((error) => {
          console.log(error)
        })
  }

  createAccount(e) {
    const component = this;
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const form = document.querySelector('.form');
    const url = '/users/?userName=' + username

    fetch(url)
        .then(function(res) {
          if (res.status === 200) {
              if (form.lastChild.className === "loginError" || form.lastChild.className === "createMsg") {
                  form.removeChild(form.lastChild)
              }
            const createMsg = document.createElement('p');
            createMsg.className = 'createMsg';
            createMsg.appendChild(document.createTextNode('Account already exists!'));
            createMsg.style.color = "red";
            form.appendChild(createMsg);
          } else if (res.status === 404) {
            // Data.userData.set(username, {password: password, isAdmin: false});
            console.log("add to database");
            // add to database
            component.addUser(username, password)
          }
        }).catch((error) => {
          console.log(error)
        });
  }

  render () {
    if (!this.props.state.loggedIn) {
      return (
        <div>
          <header className="login-header">
              <img className="title" src={require('./../../images/logo.png')}/>
          </header>
          <div className="form">
            <form className="login-form">
              <input id="username" type="username" placeholder="username"/>
              <input id="password" type="password" placeholder="password"/>
              <button className="login" onClick={this.authenticate}>login</button>
              <p className="message">Not registered? <a>Create an account</a></p><br/>
              <button className="create" onClick={this.createAccount}>create</button>
            </form>
          </div>
        </div>
      );
    } else {
      return (<Redirect to = {'/'} />);
    }
  }
}

export default Login;
