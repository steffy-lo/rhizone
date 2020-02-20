import React from 'react';
import './App.css';
import Post from './Post/component/Post';
import PostEditor from './PostEditor/PostEditor';

class App extends React.Component {
	constructor (props) {
		super(props);
		
		this.addPost = this.addPost.bind(this);

		this.state = {
			posts: [],
		};
		
	}

	
	addPost(newPostBody) {
		const newState = Object.assign({}, this.state);
		newState.posts.push(newPostBody);
		this.setState(newState);
	}
	
    render() {
		return (
		<div>
			{ 
				this.state.posts.map((postBody, idx) => {
					return (
						<Post key={idx} postBody={postBody} />
					)
				})
			}
			<PostEditor addPost={this.addPost} />
		  </div>
		);
	}
	
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

export default App;