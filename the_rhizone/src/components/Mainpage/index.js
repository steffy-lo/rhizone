import React from 'react';
import './style.css';
import PostEditor from './../PostEditor/PostEditor';
import { Link } from 'react-router-dom';
import * as Data from './../../data/hardcoded.js';
import Button from "@material-ui/core/Button";
 
//const { threadDataModel } = require('./models/threadDataModel')

class Mainpage extends React.Component {
	constructor (props) {
		super(props);
		this.addPost = this.addPost.bind(this);
		this.addThread = this.addThread.bind(this);
		this.getThreads = this.getThreads.bind(this);
		this.state = {
			posts: [],
			images: [],
			threadNumber: 0,
			loaded: false
		};
	}

	componentDidMount() {
		this.getThreads();
	}

	/*
	getThreadCount(){
		threadDataModel
		.estimatedDocumentCount()
		.then(count => {
			console.log(count)
			return count;
			//and do one super neat trick
		})
		.catch(err => {
			//handle possible errors
	})}*/
	
	  // A function to send a POST request to add a new user
  addThread(author, postTitle, postBody, imgReference) {
    // the URL for the request
    const url = '/create_thread';

    // The data we are going to send in our request
	const title = postTitle;
	const body = postBody;
	const imgRef = imgReference;
	const threadContent = {title, body, imgRef}	
	
    let data = {
		pid: -1,
		author: author,
		replies: [],
		content: threadContent
    }
	
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });
	
	console.log(request)

    // Send the request with fetch()
    fetch(request)
        .then(function(res) {

          // Handle response we get from the API.
          // Usually check the error codes to see what happened.
          if (res.status === 200) {
            window.location.reload(true);
          } else {
			  console.log(res);
          }
        }).catch((error) => {
          console.log(error)
        })
  }

    // Function to add posts (i.e threads)
	addPost(newPostBody, newImage, postTitle) {
		
		// Makes a state which will be set to the new post data
		const newState = Object.assign({}, this.state);
		newState.posts.push(newPostBody);
		const component = this;

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
		/*Data.threadData.set(Data.threadData.size, {pid:-1, author: component.props.state.user.username, replies: [],
        content:{
            title: postTitle,
            body: newPostBody,
			imgRef: imageReference,
        }
		});*/
		
		const url = '/create_thread';
		
		fetch(url)
        .then(function(res) {
			component.addThread(component.props.state.user.userName, postTitle, newPostBody, imageReference)
        }).then( data => {
			// Hide add thread button
			component.displayAddPost();
			
		}).catch((error) => {
          console.log(error)
        });
		

		
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
		console.log(this.state.threads);
		for(let i = this.state.threads.length - 1; i >= 0 ; i--){
			if(this.state.threads[i].pid == -1){
				threadDisplayState[count] = i;
				count++;
			}
		}
		return threadDisplayState
	}
	
	// // makes all threads appear. Call this method whenever we need to reload the page.
	// // Essentially, it goes through all the threadData again and sets which IDs should show
	// // in which column
	// setThreadDisplayState(){
	// 	let threadDisplayState = [];
	// 	let count = 0;
	// 	for(let i = Data.threadData.size - 1; i >= 0 ; i--){
	// 		if(Data.threadData.get(i).pid === -1){
	// 			threadDisplayState[count] = i;
	// 			count++;
	// 		}
	// 	}
	// 	return this.setState((state) => ({
	// 		threadDisplay: threadDisplayState,
	// 	}));
	// }
	
	// Loads Image in card
	imageLoad(index) {
		// null evaluates false 
		if(this.state.threads[index] === null) {
			return (<div></div>);
		} else if (this.state.threads[index].content.imgRef === "") {
			return (<div></div>);
		} else {
			/*/ IMAGE LOADING DOES NOT WORK ANYMORE BECAUSE WE HAVEN'T GOTTEN THAT TO WORK SO IMAGES ARE JUST STUFF IN THE BACKEND
			return (
			<div className = "img-sub overlay zoom view">
			<img className="card-img-top img-fluid" src={require('./../../images/' + Data.threadData.get(index).content.imgRef)}	 alt="Card image" />
			</div>
			);
		*/}
	}
	
	// Loads content (title and body) in card
	contentLoad(index) {
		return(
			<Link className='activity-link' to={"./../thread#" + this.state.threads[index]._id}>
			<h5 className = "card-title previewtitle">
			{this.state.threads[index].content.title}
			</h5>
			<p className="card-img-overlay d-flex flex-column preview">
			{this.state.threads[index].content.body}
			</p>
			</Link>
		);
	}
	
	// Loads delete button in card if user is admin
	adminDelete(index) {
        const userData = this.props.state.user;
        if (!userData) {
            return;
        }
        if (!userData.isAdmin) {
            return;
        }
        return (
            <button className="deleteButton" onClick={() => this.deleteReply(index)}>Delete</button>);
	}

	getThreads() {
		const url = "http://localhost:5000/threads"
		// Create our request constructor with all the parameters we need
		const request = new Request( url, {
			method: 'get',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		});

		// Send the request with fetch()
		fetch(request)
			.then(res => {
				return res.json();
			}).then (
			res => {
				console.log("response" + res);
				this.setState({threads: res},
					() => this.setState({threadDisplay: this.getThreadDisplay()},
						() => this.setState({loaded: true})));
			})
	}
	// Actually deletes the post, only the admin can access this function
	deleteReply(index) {
		// Data.threadData.get(index).content.body = "[deleted]";
		// Data.threadData.get(index).content.imgRef = "";
		// Data.threadData.get(index).content.title = "[deleted]";
		const threadToDel = this.state.threads[index]
		const url = "/del_thread/?tid=" + threadToDel._id
		// Create our request constructor with all the parameters we need
		const request = new Request( url, {
			method: 'delete',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		});
		console.log(this.state.threadDisplay);
		// Send the request with fetch()
		fetch(request)
			.then(res => {
				// Handle response we get from the API.
				if (res.status === 200) {
					console.log('thread deleted')
					this.setState({threadDisplay: this.getThreadDisplay()}, () => {
						window.location.reload(true)
					})

				} else {
					console.log('Failed to delete thread with index:' + index)
				}
			})
			.catch((error) => {
			console.log(error)
		})
	}
	
	// Loads content, image, and delete (if admin) into the card
	columnLoad(index) {
		if(index == null){
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
		if (this.state.loaded) {
			let logButton = "Login"
			if (this.props.state.loggedIn) {
				logButton = "Logout"
			}
			return (
				<div>
					<header className="login-header">
						<img className="title" src={require('./../../images/logo.png')}/>
						<div className="buttons">
							<div className="LinkMeLogin" onClick={() => this.props.login(false)}>
								<Link to="/login">
									<Button>{logButton}</Button>
								</Link>
							</div>
							<div className="LinkMeSettings">
								<Link to="/settings">
									<Button>Settings</Button>
								</Link>
							</div>
							<div className="LinkMeInbox">
								<Link to="/inbox">
									<Button>Inbox</Button>
								</Link>
							</div>
						</div>
					</header>
					<div className="addPostButton">
						<button className="buttonForPosting" onClick={() => this.displayAddPost()}>+Add Thread</button>
					</div>
					<div className="addingPost hidden">
						<PostEditor addPost={this.addPost}/>
					</div>

					<div className="currentPost">
						<div className="container py-1">
							<h3>Active Threads:</h3>
							<div className="row mb-1">
								{this.columnLoad(this.state.threadDisplay[this.state.threadNumber])}
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
						<div className="postingForm">
			<span className="navButton"><Button className="btn-default btn-sm"
												onClick={() => this.threadLess()}> ←Recent </Button>
			<Button className="btn-default btn-sm" onClick={() => this.threadMore()}> Previous→ </Button></span>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

}

export default Mainpage;