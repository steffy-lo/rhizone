import React from 'react';
import './styles.css';
import Mainpage from '../Mainpage';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [{username: 'user', password: 'user', userId: 0},
              {username: 'user2', password: 'user2', userId: 1},
              {username: 'user3', password: 'user3', userId: 2}]
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
        this.props.login(true);
        return;
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
      users: [...prevState.users, { username: username, password: password, userId: prevState.users.length }]
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
      return (
        <Mainpage state={this.props.state} login={this.props.login} />
      );
    }
  }
}

export default Login;
