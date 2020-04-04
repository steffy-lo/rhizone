import React from 'react';
import './style.css';
import PostEditor from './../PostEditor/PostEditor';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Button from "@material-ui/core/Button";

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
	
	  // A function to send a POST request to add a new user
  addThread(author, postTitle, postBody, imgReference) {
    // the URL for the request
	
    const url = '/create_thread';

    const threadContent = {title: postTitle, body: postBody, imgRef: imgReference};
	
    let data = {
		author: author,
		replies: [],
		content: threadContent
    };
	
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

	const component = this;

    // Send the request with fetch()
    fetch(request)
        .then(function(res) {
		  console.log(res)
          // Handle response we get from the API.
          // Usually check the error codes to see what happened.
          if (res.status === 200) {
              return res.json();
          } else {
			  console.log(res);
			  return null;
          }
        }).then((res) => {
            if (res == null) { return; }
			component.displayAddPost();
            component.addPastPost(author, res._id);
            window.location.reload(true);
        }).catch((error) => {
          console.log(error)
        })
  }

  addPastPost(user, hash){
    const url = '/inboxes/add_pastPosts'

    const data = {
        userName: user,
        pastPosts: {
            rootID: hash,
            activityID: hash
        }
    }

    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    // Send the request with fetch()
    fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                console.log('past Post added')
                return res.json();
            } else {
                console.log('Failed to add past Post')
                return null;
            }
        }).catch((error) => {
      console.log(error)
    });
  }

    // Function to add posts (i.e threads)
	addPost(postEditor, newPostBody, newImage, postTitle, thread) {
		const component = this;
		let imageReference = "";
		// the URL for the request

		if (newImage != null) {
			const url = "/images";
			// Create our request constructor with all the parameters we need
			const request = new Request(url, {
				method: "post",
				body: newImage,
			});

			// Send the request with fetch()
			fetch(request)
				.then(function (res) {
					// Handle response we get from the API.
					// Usually check the error codes to see what happened.
					if (res.status === 200) {
						// If image was added successfully, tell the user.
						postEditor.setState({
							message: "Success: Uploaded an image."
						});
						return res.json();
					} else {
						// If server couldn't add the image, tell the user.
						// Here we are adding a generic message, but you could be more specific in your app.
						postEditor.setState({
							message: "Error: Could not add image."
						});
					}
				})
				.then(res => {
					if (res == null) {
						return;
					}
					imageReference = res;
					component.addThread(component.props.state.user.userName, postTitle, newPostBody, imageReference)
				})
				.catch(error => {
					console.log(error);
				});
		} else {
			component.addThread(component.props.state.user.userName, postTitle, newPostBody, imageReference)
		}
		
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

	
	// Loads Image in card
	imageLoad(index) {
		// null evaluates false 
		if(this.state.threads[index] === null) {
			return (<div></div>);
		} else if (this.state.threads[index].content.imgRef == null) {
			return (<div></div>);
		} else {
			return (
			<div className = "img-sub overlay zoom view">
			<img className="card-img-top img-fluid" src={this.state.threads[index].content.imgRef.image_url} alt="Card image" />
			</div>
			);
		}
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
		const url = "/threads"
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

  deletePastPost(user, hash){
    const url = '/inboxes/delete_pastPosts'

    const data = {
        userName: user,
        pastPosts: hash
    }

    const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    // Send the request with fetch()
    fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                console.log('past Post deleted')
                return res.json();
            } else {
                console.log('Failed to delete past Post')
                return null;
            }
        }).catch((error) => {
      console.log(error)
    });
	}

	// Actually deletes the post, only the admin can access this function
	deleteReply(index) {
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
		const component = this;
		// Send the request with fetch()
		fetch(request)
			.then(res => {
				// Handle response we get from the API.
				if (res.status === 200) {
					return res.json();
				} else {
					console.log('Failed to delete thread with index:' + index)
					return null;
				}
			}).then(res => {
			    if (res == null) { return; }
			    this.deletePastPost(res.author, res._id);
                console.log('thread deleted')
				this.setState({threadDisplay: this.getThreadDisplay()}, () => {
				    window.location.reload(true)
				})
			}).catch((error) => {
			console.log(error)
		})

		if (threadToDel.content.imgRef != null) { // then delete image too
			// the URL for the request
			const url = `/images/${threadToDel.content.imgRef.image_id}`;

			// Create our request constructor with all the parameters we need
			const request = new Request(url, {
				method: "delete",
			});

			// Send the request with fetch()
			fetch(request)
				.then(function (res) {
					if (res.status === 200) {
						console.log("Image deleted")
						return res.json()
					} else {
						console.log("An error occurred when trying to delete image.")
					}
				})
				.then(res => {
					console.log(res)
				})
				.catch(error => {
					console.log(error);
				});
		}
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