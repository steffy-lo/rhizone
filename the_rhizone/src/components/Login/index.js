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
            <button class="login">login</button>
            <p class="message">Not registered? <a>Create an account</a></p><br/>
            <button class="create">create</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
