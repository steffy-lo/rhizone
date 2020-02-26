import React from 'react';
import './styles.css';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [{username: 'sunshinegirl100', password: 'password123', userId: 0},
              {username: 'theonehero', password: '1234567', userId: 1},
              {username: 'user1', password: 'password1', userId: 2}]

    };

    this.authenticate = this.authenticate.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    console.log(this.state.users);
    const form = document.querySelector('.form');
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;

    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i].username == username && this.state.users[i].password == password) {
        console.log("yay");
        window.location.replace("http://localhost:3000/");
        return;
      }
    }

    if (document.querySelector('.loginError') == null) {
      let pElement = document.createElement('p');
      pElement.className = 'loginError';
      pElement.appendChild(document.createTextNode('Incorrect username or password.'));
      form.appendChild(pElement);
    }
  }

  render () {
    return (
      <div>
        <header className="login-header">
          <h1><a href="/">The RhiZone</a></h1>
        </header>
        <div class="form">
          <img /* Can include logo here *//>
          <form class="login-form">
            <input className="username" type="username" placeholder="username"/>
            <input className="password" type="password" placeholder="password"/>
            <button class="login" onClick={this.authenticate}>login</button>
            <p class="message">Not registered? <a>Create an account</a></p><br/>
            <button class="create">create</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
