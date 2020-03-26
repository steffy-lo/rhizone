import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';
import ls from 'local-storage';
import PostEditor from './../PostEditor/PostEditor';
import * as Data from './../../data/hardcoded.js';
import './style.css';
import Button from "@material-ui/core/Button";

class Thread extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      replyNum: 0,
      loaded: false,
      threadId: this.getThreadId(),
      mainThread: Data.threadData,
      replies: {}
    };

    this.loadThread = this.loadThread.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.loadReplies = this.loadReplies.bind(this);
    this.createReply = this.createReply.bind(this);
    this.loadReply = this.loadReply.bind(this);
    this.addReply = this.addReply.bind(this);
    this.getMainThread = this.getMainThread.bind(this);
    this.addReplyToThread = this.addReplyToThread.bind(this);
    this.deleteThread = this.deleteThread.bind(this);
  }

  getThreadId() {
    return window.location.hash.substring(1);
  }

  componentWillMount() {
    this.getMainThread()
  }

  getMainThread() {
    const url = "http://localhost:5000/threads/" + this.state.threadId

    // Send the request with fetch()
    fetch(url)
        .then(res => {
          return res.json();
        }).then (
        res => {
          console.log("response" + res);
          this.setState({mainThread: res},
                  () => this.setState({loaded: true}));
        })

  }

  deleteThread(threadToDel) {
    console.log(threadToDel)
    const url = "http://localhost:5000/del_thread/?tid=" + threadToDel._id
    // Create our request constructor with all the parameters we need
    const request = new Request( url, {
      method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });
    // Send the request with fetch()
    fetch(request)
        .then(res => {
          return res.json()
        })
        .then(res => {
          console.log(res)
          window.location.reload(true)
        })
        .catch((error) => {
          console.log(error)
        })

  }

  renderAdminMainThreadInfo() {
    const userData = Data.userData.get(this.state.username);
    if (!userData) { return;}
    if (!userData.isAdmin) { return;}

    let tid = Number(this.props.id.split("#")[1]);
    let threadInfo = Data.threadData.get(tid);
    if (!threadInfo) { return; }

    while (threadInfo.pid != -1){
        tid = threadInfo.pid;
        threadInfo = Data.threadData.get(tid);
        if (!threadInfo) { return; }
    }
    return (
        <p>
            <span>Replies: {threadInfo.replies.length} </span>
            <span>Author: {threadInfo.author} </span>
            <span>Post #: {tid}</span>
        </p>
    );
  }

  renderAdminRepliesInfo() {
    const userData = Data.userData.get(this.state.username);
    if (!userData) { return;}
    if (!userData.isAdmin) { return;}

    const tid = Number(this.props.id.split("#")[1]);
    const threadInfo = Data.threadData.get(tid);
    if (!threadInfo) { return; }
    return (
        <p> Post #: {tid} </p>
    );
  }

  loadThread() {
    return(
      <div className='rootPost'>
        <h2>{this.state.mainThread.content.title}</h2>
        <p>
          {this.state.mainThread.content.body}
        </p>
        {this.loadImage(this.state.mainThread)}
      </div>
    );
  }

  loadImage(thread) {
    if (thread.content.imgRef === "")
    {
      return (<img/>);
    } else {
      return (
        <img className="threadImage" src={require('./../../images/' + thread.content.imgRef)}	 alt="Thread Image" />
      );
    }
  }

  loadReplies(thread) {
    let replies = [];
    for (let i = 0; i < thread.replies.length; i++) {
			replies.push(this.loadReply(thread.replies[i]));
			console.log("UHH" + i)
     
    }

    return(
      <div className="threadBody">
        <ul className="list-unstyled">
          {replies}
        </ul>
      </div>
    );
  }

  createReply(e) {

    if (this.props.state.loggedIn) {
			const editor = e.target.parentElement.lastChild;
			editor.classList.toggle("hidden");
      // hides the reply button
      editor.previousSibling.classList.toggle("hidden");
		} else {
			window.location.replace('/login');
		}
  }

  loadReply(thread) {
    let replies;
    let adminButton;
    const component = this;
    const userData = this.props.state.user;

    if (userData && userData.isAdmin) {
        adminButton = <button className="deleteBtn" onClick={() => this.deleteThread(thread)}>Delete</button>;
    }

    console.log(thread) 
    if (thread.replies.length !== 0) {
      replies = thread.replies.map(reply => (
        <ul>
          <li className="media" id={this.state.threadId+"#"+reply.id}>
            <div className="media-body">
			  <a href={"#"+this.state.threadId+"#"+reply.pid_num}>Replying to: {reply.pid_num}</a> <a href={"#" + this.state.threadId+"#"+reply.id}>Post Number: {reply.id}</a> <br />
              {reply.content.body} <br/>
              {this.loadImage(reply)} <br/>
              {
                (function(){
                  if (userData && userData.isAdmin) return (<button className="deleteBtn" onClick={() => component.deleteThread(reply)}>Delete</button>);
                })()
              }
              <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
              <div className="hidden">
                <PostEditor className="replyPostEditor" addPost={this.addReply} thread={reply} isReply={true}/>
              </div>
              {this.loadReplies(reply)}
            </div>
          </li>
        </ul>
      ));
    }
		return(
        <li className="media" id={this.state.threadId+"#"+thread.id}>
          <div className="media-body">
			<a href={"#"+this.state.threadId+"#"+thread.id}>POST ID: {thread.id}</a> <a href={"#" +this.state.threadId+"#"+thread.pid_num}>PARENT ID: {thread.pid_num}</a>
            <div className ="text-body">{thread.content.body}</div>
            {this.loadImage(thread)} <br/>
            {adminButton}
            <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
            <div className="hidden">
              <PostEditor className="replyPostEditor" addPost={this.addReply} thread={thread} isReply={true}/>
            </div>
            {replies}
          </div>
        </li>
    );

  }

  addReplyToThread(thread, reply) {
    const data = {
      id: thread._id,
      pid: thread.pid,
	  pid_num: thread.id,
      reply: reply
    }

    const url = 'http://localhost:5000/threads';

    // Create our request constructor with all the parameters we need
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
          // Handle response we get from the API.
          // Usually check the error codes to see what happened.
          if (res.status === 200) {
            window.location.reload(true)
          } else {
            console.log(res);
          }
        }).catch((error) => {
      console.log(error)
    });

  }

  addReply(newPostBody, newImage, postTitle, thread) {
    console.log("parent thread", thread);
    const component = this;
      // add Post to archive
      let imageReference = "";

      if (newImage == null){
      } else {
              imageReference = newImage.name;
      }

    const reply = {
        pid: thread._id,
		pid_num: thread.id,
        author: this.props.state.user.userName,
        replies: [],
        content: {
            title: postTitle,
            body: newPostBody,
            imgRef: imageReference,
        }
    };

      // the URL for the request
      const url = 'http://localhost:5000/create_thread';

      // Create our request constructor with all the parameters we need
      const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(reply),
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      });

      // Send the request with fetch()
      fetch(request)
        .then(res => {
          return res.json();
        }).then ( res => {
          console.log(res);
          component.addReplyToThread(thread, res);
        })
          .catch((error) => {
            console.log(error)
      });
  }

  render () {
    if (this.state.loaded) {
      return (
          <div className="threadPage">
            <div className="jumbotron text-center">
              <img className="title" src={require('./../../images/logo.png')}/>
              <div className="buttons">
                <div className="LinkMeLogin" onClick={() => this.props.login(false)}>
                  <Link to="/">
                    <Button>Logout</Button>
                  </Link>
                </div>
                <div className="LinkMeSettings">
                  <Link to={{pathname: '/settings'}}>
                    <Button className="settings">Settings</Button>
                  </Link>
                </div>
                <div className="LinkMeInbox">
                  <Link to={{pathname: '/inbox'}}>
                    <Button className="inbox">Inbox</Button>
                  </Link>
                </div>
                <div className="LinkMeHome">
                  <Link to="/">
                    <Button>Home</Button>
                  </Link>
                </div>
              </div>
            </div>

            {this.loadThread()}

            <div className='threadReply'>
              <p>Add reply to thread: </p>
              <PostEditor className="replyPostEditor" addPost={this.addReply} thread={this.state.mainThread}
                          isReply={true}/>
            </div>

            {this.loadReplies(this.state.mainThread)}

          </div>
      );
    } else {
      return null;
    }
  }
}

export default Thread;
