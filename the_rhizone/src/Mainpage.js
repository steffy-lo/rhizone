import React from 'react';
import './Mainpage.css';
import Post from './Post/component/Post';
import PostEditor from './PostEditor/PostEditor';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';


class Mainpage extends React.Component {
	constructor (props) {
		super(props);
		
		this.addPost = this.addPost.bind(this);

		this.state = {
			posts: [],
			threadDisplay: 0,
		};
		
		this.login = {
		}
		
	}

	
	addPost(newPostBody, newImage) {
		const newState = Object.assign({}, this.state);
		newState.posts.push(newPostBody);
		this.setState(newState);
	}
	
	threadMore() {
		console.log(this.state.threadDisplay)
		return this.setState((state) => ({
			threadDisplay: state.threadDisplay + 9,
		}));
	}
		
    render() {
		return (
		
		<div>
			
			
			<div className = "LinkMeLogin" ><Link to="/login">Login</Link></div>	
			<div className = "ZeldaMeAccount" ><Link to="/settings">Account</Link></div>
			
			<div className = "currentPost">
			
			<div class="container py-3">
			<div class="row mb-1">
				<div class="col-4 card">
					<img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay]}
					</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 1]}
					</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 2]}
					</p>
				</div>
			</div>
			 <div class="row mb-1">
				<div class="col-4 card">
				<img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 3]}
					</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 4]}
					</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 5]}
					</p>
				</div>
				</div>
				<div class="row mb-1">
				<div class="col-4 card">
				<img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 6]}
					</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 7]}</p>
				</div>
				 <div class="col-4 card">
				 <img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
					<p class="preview card-text text-sm-left text-monospace card-img-overlay">
					{this.state.posts[this.state.threadDisplay + 8]}
					</p>
				</div>
			</div>
		 </div>		
			
			<button className = "btn btn-success" onClick={() => this.threadMore()}>more</button>
			
			<PostEditor addPost={this.addPost} />
			</div>				
			{ 
			//this.state.posts.map((postBody, idx) => {
			//return (
				//<Post key={idx} postBody={postBody}/>
			//)
		//})
	}
		</div>
		);
	}
}

export default Mainpage;