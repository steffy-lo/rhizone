import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Login from './components/Login'
import Settings from './components/Settings';
import Thread from './components/Thread';
import Mainpage from './components/Mainpage';
import Inbox from './components/Inbox';
import ls from 'local-storage';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: null,
      loggedIn: false
    }
  }

  componentDidMount() {
    this.setState({
      username: ls.get('username'),
      loggedIn: ls.get('loggedIn')
    });
  }
  
  login = (val, username) => {
    this.setState({username: username, loggedIn: val})
    ls.set('username', username)
    ls.set('loggedIn', val)
  }

  render() {
    console.log(this.state)
		return (
		<div>
        <BrowserRouter>
            <Switch> { /* Similar to a switch statement - shows the component depending on the URL path */ }
              { /* Each Route below shows a different component depending on the exact path in the URL  */ }
              <Route exact path='/login' render={() =>
                              (<Login state={this.state} login={this.login}/>)}/>
			  <Route exact path='/' render={() =>
                              (<Mainpage state={this.state} login={this.login}/>)}/>
              <Route exact path='/settings' render={() =>
                              (<Settings state={this.state} login={this.login}/>)}/>
              <Route exact path='/inbox' render={() =>
                              (<Inbox state={this.state} login={this.login}/>)}/>
              <Route path='/thread' render={(location) =>
                              (<Thread state={this.state} login={this.login} id={location.location.hash}/>)}/>
            </Switch>
          </BrowserRouter>
		</div>
		);
	}
}

export default App;
