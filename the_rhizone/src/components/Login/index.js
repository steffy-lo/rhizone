import React from 'react';
import './styles.css';

class Login extends React.Component {
  render () {
    return (
      <div>
        <header className="login-header">
          <h1>The RhiZone</h1>
        </header>
        <div class="form">
          <img /* Can include logo here *//>
          <form class="login-form">
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button>login</button>
            <p class="message">Not registered? <a href="#">Create an account</a></p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
