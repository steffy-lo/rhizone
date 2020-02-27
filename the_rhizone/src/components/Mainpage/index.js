import React from 'react';
import './style.css';
import PostEditor from './../PostEditor/PostEditor';
import { Link } from 'react-router-dom';
 import * as Data from './../../data/hardcoded.js';

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

  
	addPost(newPostBody, newImage, postTitle) {
		const newState = Object.assign({}, this.state);
		newState.posts.push(newPostBody);
		
		if(newImage == null){
		}else {
			// rename newImage to be threadNumber
			// File Upload not supported yet because we need a database to access such files. We only have hardcoded files.
			var new_file = new File([newImage], newState.threadNumber + '.jpg', {type: 'image/jpeg'});
		}
		
		newState.images.push(new_file);
		this.setState(newState);
		
		// add Post to archive
		let imageReference = "";
		
		if (newImage == null){
		}else {
				imageReference = new_file.name;
		}
		
		Data.threadData.set(Data.threadData.size, {pid:-1, author:"user", replies: [],
        content:{
            title: postTitle,
            body: newPostBody,
			imgRef: imageReference,
        }
		});
		this.setThreadDisplayState();
		this.displayAddPost();
	}
	
	threadMore() {
		console.log(this.state.threadNumber)
		return this.setState((state) => ({
			threadNumber: state.threadNumber + 9,
		}));
	}
	
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
	
	imageLoad(index) {
		// null evaluates false 
		if(Data.threadData.get(index) == null || Data.threadData.get(index) === null ){
			return (<div></div>);
		} else if (Data.threadData.get(index).content.imgRef == "")
		{
			return (<div></div>);
		} else {
			return (<img className="card-img-top" src={require('./../../images/' + Data.threadData.get(index).content.imgRef)}	 alt="Card image" />);
		}
	}
	
	contentLoad(index) {
		return(
			<Link className='activity-link' to={"./../Thread#" + index}>
			<h5 className = "text-sm card-img-overlay card-title">
			{Data.threadData.get(index).content.title}
			</h5>
			<p className="preview card-text text-sm-left card-img-overlay">
			{Data.threadData.get(index).content.body}
			</p>
			</Link>
		);
	}
	
	columnLoad(index) {
		if(index == null || index === null){
		} else {
		return (
			<div className="col-4 card">
					{this.imageLoad(index)}
					{this.contentLoad(index)}
			</div>
		);
		}
	}
	
	displayAddPost(){
		let element = document.querySelector('.addingPost')
		element.classList.toggle("hidden");
		let elementButton = document.querySelector('.addPostButton')
		elementButton.classList.toggle("hidden");
	}
	
    render() {
			return (
		<div>
			<header className="login-header">
           <h1>The RhiZone</h1>
			</header>
			<div className = "addPostButton"><button className = "buttonForPosting" onClick={() => this.displayAddPost()}>+ Post Thread</button></div>
			<div className = "LinkMeLogin" ><Link to="/login">Login</Link></div>	
			<div className = "ZeldaMeAccount" ><Link to="/settings">Account</Link></div>
			<div className = "LinkMeInbox" ><Link to="/inbox">Inbox</Link></div>
			
			<div className = "addingPost hidden">
			<PostEditor addPost={this.addPost} />
			</div>
			
			<div className = "currentPost center-block">
			<h3>Active Threads:</h3>
			<div className="container py-1">
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
			<button className = "btn-default btn-sm center-block" onClick={() => this.threadMore()}> → </button>
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