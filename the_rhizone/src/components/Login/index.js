import React from 'react';
import './styles.css';
import Mainpage from '../Mainpage';
import { Redirect} from 'react-router-dom';
import * as Data from './../../data/hardcoded.js';

class Login extends React.Component {

  constructor(props) {
    super(props);
    const userData = [];
    for (let [key, value] of Data.userData.entries()) {
      userData.push({username: key, password: value.password, isAdmin: value.isAdmin})
    }
    this.state = {
      users: userData
    };

    this.authenticate = this.authenticate.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    console.log(this.state.users);
    const form = document.querySelector('.form');
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i].username === username && this.state.users[i].password === password) {
        this.props.login(true, username);
      }
    }

    if (document.querySelector('.loginError') == null) {
      let pElement = document.createElement('p');
      pElement.className = 'loginError';
      pElement.appendChild(document.createTextNode('Incorrect username or password.'));
      pElement.style.color = "red";
      form.appendChild(pElement);
    }
  }

  createAccount(e) {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    this.setState(prevState => ({
      users: [...prevState.users, { username: username, password: password, isAdmin: false }]
    }))
  }

  render () {
    if (!this.props.state.loggedIn) {
      return (
        <div>
          <header className="login-header">
            <h1><a href="/">The RhiZone</a></h1>
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
