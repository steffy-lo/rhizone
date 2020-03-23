import React from 'react';
import './style.css';
import PostEditor from './../PostEditor/PostEditor';
import { Link } from 'react-router-dom';
import * as Data from './../../data/hardcoded.js';
import Button from "@material-ui/core/Button";
 

class Mainpage extends React.Component {
	constructor (props) {
		super(props);
		this.addPost = this.addPost.bind(this);
		this.state = {
			posts: [],
			threadDisplay: this.getThreadDisplay(),
			images: [],
			threadNumber: 0,
		};
		
		this.login = {
		}
				
	}

    // Function to add posts (i.e threads)
	addPost(newPostBody, newImage, postTitle) {
		
		// Makes a state which will be set to the new post data
		const newState = Object.assign({}, this.state);
		newState.posts.push(newPostBody);
		
		// If there is no image attached to the post do nothing
		if(newImage == null){
		}else {
			// rename newImage to be threadNumber
			// File Upload not supported yet because we need a database to access such files. We only have hardcoded files.
			var new_file = new File([newImage], newState.threadNumber + '.jpg', {type: 'image/jpeg'});
		}
		
		// Regardless, push the image in the current state
		newState.images.push(new_file);
		this.setState(newState);
		
		// add Post to archive
		let imageReference = "";
		
		// Name the image
		if (newImage == null){
		}else {
				imageReference = new_file.name;
		}
		
		// set the data in hardcoded.js to what the post contents are. Because we have not done a back-end, this data will not save on reload.
		Data.threadData.set(Data.threadData.size, {pid:-1, author:"user", replies: [],
        content:{
            title: postTitle,
            body: newPostBody,
			imgRef: imageReference,
        }
		});
		
		// Reload threads
		this.setThreadDisplayState();
		
		// Hide add thread button
		this.displayAddPost();
	}
	
	// This function displays or hides the Add Thread section based off whether or not it is clicked or not
	displayAddPost(){
		if(this.props.state.loggedIn){
			let element = document.querySelector('.addingPost')
			element.classList.toggle("hidden");
			let elementButton = document.querySelector('.addPostButton')
			elementButton.classList.toggle("hidden");
		} else {
			window.location.replace('/login');
		}
		
	}
	
	// Shows archived threads, corresponds with -> arrow
	threadMore() {
		return this.setState((state) => ({
			threadNumber: state.threadNumber + 9,
		}));
	}
	
	// Shows more current threads, corresponds with <- arrow
	threadLess() {
		if (this.state.threadNumber >= 9) {
			return this.setState((state) => ({
			threadNumber: state.threadNumber - 9,
		}));
		}	
	}
	
	// gets current thread display state
	getThreadDisplay(){
		let threadDisplayState = [];
		let count = 0;
		for(let i = Data.threadData.size - 1; i >= 0 ; i--){
			if(Data.threadData.get(i).pid === -1){
				threadDisplayState[count] = i;
				count++;
			}
		}
		return threadDisplayState
	}
	
	// makes all threads appear. Call this method whenever we need to reload the page.
	// Essentially, it goes through all the threadData again and sets which IDs should show 
	// in which column
	setThreadDisplayState(){
		let threadDisplayState = [];
		let count = 0;
		for(let i = Data.threadData.size - 1; i >= 0 ; i--){
			if(Data.threadData.get(i).pid === -1){
				threadDisplayState[count] = i;
				count++;
			}
		}
		return this.setState((state) => ({
			threadDisplay: threadDisplayState,
		}));
	}
	
	// Loads Image in card
	imageLoad(index) {
		// null evaluates false 
		if(Data.threadData.get(index) == null || Data.threadData.get(index) === null ){
			return (<div></div>);
		} else if (Data.threadData.get(index).content.imgRef == "")
		{
			return (<div></div>);
		} else {
			return (
			<div className = "img-sub">
			<img className="card-img-top" src={require('./../../images/' + Data.threadData.get(index).content.imgRef)}	 alt="Card image" />
			</div>
			
			);
		}
	}
	
	// Loads content (title and body) in card
	contentLoad(index) {
		return(
			<Link className='activity-link' to={"./../thread#" + index}>
			<h5 className = "card-title previewtitle">
			{Data.threadData.get(index).content.title}
			</h5>
			<p className="card-img-overlay d-flex flex-column preview">
			{Data.threadData.get(index).content.body}
			</p>
			</Link>
		);
	}
	
	// Loads delete button in card if user is admin
	adminDelete(index) {
		const userData = Data.userData.get(this.props.state.user);
		if (!userData) { return;}
		if (!userData.isAdmin) { return;}
		return(
		<button className = "deleteButton" onClick={() => this.deleteReply(index)}>Delete</button>);
	}
	
	// Actually deletes the post, only the admin can access this function
	deleteReply(index) {
		Data.threadData.get(index).content.body = "[deleted]";
		Data.threadData.get(index).content.imgRef = "";
		Data.threadData.get(index).content.title = "[deleted]";
		// Reload threads
		this.setThreadDisplayState();
	}
	
	// Loads content, image, and delete (if admin) into the card
	columnLoad(index) {
		if(index == null || index === null){
		} else {
		return (
			<div className="col-4 card">
					{this.contentLoad(index)}
					{this.imageLoad(index)}
					{this.adminDelete(index)}
			</div>
		);
		}
	}
	
    render() {
		let logButton = "Login"
		if (this.props.state.loggedIn) {
			logButton = "Logout"
		}
		return (
		<div>
			<header className="login-header">
				<h1 className="title">The RhiZone</h1>
				<div className = "buttons">
				<div className = "LinkMeLogin" onClick={() => this.props.login(false)} >
				<Link to="/login">
					<Button>{logButton}</Button>
				</Link>
				</div>
				<div className = "LinkMeSettings" >
					<Link to="/settings">
						<Button>Settings</Button>
					</Link>
				</div>
				<div className = "LinkMeInbox" >
					<Link to="/inbox">
						<Button>Inbox</Button>
					</Link>
				</div>
				</div>
			</header>
			<div className = "addPostButton"><button className="buttonForPosting" onClick={() => this.displayAddPost()}>+Add Thread</button></div>
			<div className = "addingPost hidden">
			<PostEditor addPost={this.addPost} />
			</div>

			<div className="currentPost">
			<div className="container py-1">
				<h3>Active Threads:</h3>
			<div className="row mb-1">
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 0])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 1])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 2])}
			</div>
			<div className="row mb-1">
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 3])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 4])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 5])}
			</div>
				<div className="row mb-1">
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 6])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 7])}
				{this.columnLoad(this.state.threadDisplay[this.state.threadNumber + 8])}
			</div>
		</div>
			<div className = "postingForm">
			<span className ="navButton"><Button className="btn-default btn-sm" onClick={() => this.threadLess()}> ← </Button>
			<Button className = "btn-default btn-sm" onClick={() => this.threadMore()}> → </Button></span>

			</div>
			</div>
		</div>
		);
	}
}

export default Mainpage;