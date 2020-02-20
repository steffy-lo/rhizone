// Importing react-router-dom to use the React Router
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';

import Login from './components/Login'
import Settings from './components/Settings';
import Threads from './components/Threads';
import Inbox from './components/Inbox';


class LoginSwitch extends React.Component {

  // a 'global' state that you can pass through to any child componenets of App.
  state = {
  }

  render() {
    return (
      <div>
        <BrowserRouter>
            <Switch> { /* Similar to a switch statement - shows the component depending on the URL path */ }
              { /* Each Route below shows a different component depending on the exact path in the URL  */ }
              <Route exact path='/' render={() => 
                              (<Login state={this.state}/>)}/>
              <Route exact path='/settings' render={() => 
                              (<Settings state={this.state}/>)}/>
              <Route exact path='/inbox' render={() => 
                              (<Inbox state={this.state}/>)}/>
              <Route exact path='/threads' render={() => 
                              (<Threads state={this.state}/>)}/>
            </Switch>
          </BrowserRouter>
      </div>
    );
  }
}