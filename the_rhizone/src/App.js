import React from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './Post/component/Post';
import PostEditor from './PostEditor/PostEditor';

class App extends React.Component {
	/*
	 // a 'global' state that you can pass through to any child componenets of App.
  //   In the Routes below they are passed to each view, to maintain login
  state = {
    login: "123"
  }
	
  render() {
    return (
        <div>
        <BrowserRouter> // this renders different urls based off module
          <Switch> {  }
            {  }
            <Route exact path='/' render={() => 
                            (<Home state={this.state}/>)}/> // Button is in the home page
            <Route exact path='/queue' render={() => 
                            (<Queue state={this.state}/>)}/>

          </Switch>
        </BrowserRouter>
      </div>
    );  
  } */
  
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
}

export default App;
