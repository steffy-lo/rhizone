import React from 'react';
import './style.css';
import Post from './../Post/component/Post';
import PostEditor from './../PostEditor/PostEditor';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';


class Mainpage extends React.Component {
	constructor (props) {
		super(props);
		
		this.addPost = this.addPost.bind(this);

		this.state = {
			posts: [],
			threadDisplay: 0,
			images: [],
			threadNumber: 0,
		};
		
		this.login = {
		}
				
	}

	
	addPost(newPostBody, newImage) {
		const newState = Object.assign({}, this.state);
		newState.threadNumber += 1;
		newState.posts.push(newPostBody);
		
		if(newImage == null){
		}else {
			// rename newImage to be threadNumber
			var new_file = new File([newImage], newState.threadNumber + '.jpg', {type: 'image/jpeg'});
		}
		
		newState.images.push(new_file);
		this.setState(newState);
	}
	
	threadMore() {
		console.log(this.state.threadDisplay)
		return this.setState((state) => ({
			threadDisplay: state.threadDisplay + 9,
		}));
	}
	
	imageLoad(index) {
		// null evaluates false 
		if(this.state.images[index] === null || this.state.images[index] == null){
			return (<div></div>);
		} else {
			return (<img class="card-img-top" src={require('./../../images/' + this.state.images[index].name)}	 alt="Card image" />);
		}
	}
	
	contentLoad(index) {
		return(
			<Link className='activity-link' to={"./../Thread"}>
			<p class="preview card-text text-sm-left text-monospace card-img-overlay">
			{this.state.posts[index]}
			</p>
			</Link>
		);
	}
	
	columnLoad(index) {
		return (
			<div class="col-4 card">
					{this.imageLoad(index)}
					{this.contentLoad(index)}
			</div>
		);
	}
	
		
    render() {
		return (
		
		<div>
			<header className="login-header">
           <h1>The RhiZone</h1>
			</header>
			
			<div className = "LinkMeLogin" ><Link to="/login">Login</Link></div>	
			<div className = "ZeldaMeAccount" ><Link to="/settings">Account</Link></div>
			<div className = "LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
			
			<div className = "currentPost">
			
			<div class="container py-1">
			<div class="row mb-1">
				{this.columnLoad(this.state.threadDisplay)}
				{this.columnLoad(this.state.threadDisplay + 1)}
				{this.columnLoad(this.state.threadDisplay + 2)}
			</div>
			 <div class="row mb-1">
				{this.columnLoad(this.state.threadDisplay + 3)}
				{this.columnLoad(this.state.threadDisplay + 4)}
				{this.columnLoad(this.state.threadDisplay + 5)}
			</div>
				<div class="row mb-1">
				{this.columnLoad(this.state.threadDisplay + 6)}
				{this.columnLoad(this.state.threadDisplay + 7)}
				{this.columnLoad(this.state.threadDisplay + 8)}
			</div>
		 </div>		
			<div className = "postingForm">
			<button className = "btn-default btn-sm center-block" onClick={() => this.threadMore()}> → </button>
			<PostEditor addPost={this.addPost} />
			</div>
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