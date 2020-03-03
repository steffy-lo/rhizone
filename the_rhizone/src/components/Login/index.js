import React from 'react';
import './styles.css';
import { Redirect} from 'react-router-dom';
import * as Data from './../../data/hardcoded.js';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    const form = document.querySelector('.form');
    if (form.lastChild.className === "loginError" || form.lastChild.className === "createMsg") {
      form.removeChild(form.lastChild)
    }
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (Data.userData.get(username) !== undefined && Data.userData.get(username).password === password) {
      this.props.login(true, username);
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
    const form = document.querySelector('.form');
    if (form.lastChild.className === "loginError" || form.lastChild.className === "createMsg") {
      form.removeChild(form.lastChild)
    }
    let createMsg = document.createElement('p');
    createMsg.className = 'createMsg';
    if (Data.userData.get(username) === undefined) { // get from database
      createMsg.appendChild(document.createTextNode('Account successfully created!'));
      createMsg.style.color = "green";
      form.appendChild(createMsg);
      Data.userData.set(username, {password: password, isAdmin: false}) // add to database
    } else {
      createMsg.appendChild(document.createTextNode('Account already exists!'));
      createMsg.style.color = "red";
      form.appendChild(createMsg);
    }
  }

  render () {
    if (!this.props.state.loggedIn) {
      return (
        <div>
          <header className="login-header">
            <h1 className="title">The RhiZone</h1>
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
