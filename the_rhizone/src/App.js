import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Post from './components/Post/component/Post';
import PostEditor from './components/PostEditor/PostEditor';
import Login from './components/Login'
import Settings from './components/Settings';
import Thread from './components/Thread';
import Mainpage from './components/Mainpage';
import Inbox from './components/Inbox';


class App extends React.Component {
	state = {
	    userName: 'user'
	}


    render() {
		return (

		<div>
        <BrowserRouter>
            <Switch> { /* Similar to a switch statement - shows the component depending on the URL path */ }
              { /* Each Route below shows a different component depending on the exact path in the URL  */ }
               <Route exact path='/login' render={() =>
                              (<Login state={this.state}/>)}/>
			   <Route exact path='/' render={() =>
                              (<Mainpage state={this.state}/>)}/>
              <Route exact path='/settings' render={() =>
                              (<Settings state={this.state}/>)}/>
              <Route exact path='/inbox' render={() =>
                              (<Inbox state={this.state}/>)}/>
              <Route exact path='/thread' render={() =>
                              (<Thread state={this.state}/>)}/>
            </Switch>
          </BrowserRouter>
		</div>
		);
	}
}

export default App;
