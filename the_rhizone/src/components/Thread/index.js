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
        threads: {}
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
    this.getReplies = this.getReplies.bind(this);
    this.getMainThread();
  }

  getThreadId() {
    return window.location.hash.substring(1);
  }

  getMainThread() {
      const component = this;
    const url = "/threads/" + this.state.threadId;

    // Send the request with fetch()
    fetch(url)
        .then(res => {
          return res.json();
        }).then (
        res => {
          console.log("response" + res);
            component.setState(prevState => {
                let threads = {...prevState.threads};
                threads[res._id] = res;
                return {threads};
            });
          this.setState({mainThread: res},
                  () => {
              setTimeout(function() {
                  component.setState({loaded: true})
              }, 1000)
              this.getReplies(res)
                  })
        })

  }

  deleteThread(threadToDel) {
    const url = "/del_thread/?tid=" + threadToDel._id
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

  getReplies(thread) {
      const component = this;
      if (thread.replies.toString() === '') return;
      const url = "/replies/?ids=" + thread.replies.toString();
      // Create our request constructor with all the parameters we need
      const request = new Request(url, {
          method: 'get',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
          },
      });

      fetch(request)
          .then(res => {
              return res.json();
          }).then (res => {
              console.log("got replies");
              for (let i = 0; i < res.length; i++) {
                  component.setState(prevState => {
                      let threads = {...prevState.threads};
                      threads[res[i]._id] = res[i];
                      return {threads};
                  });
                  if (res[i].replies.length > 0) {
                      component.getReplies(res[i])

                  }
              }
      }).catch((error) => {
          console.log(error)
      })
  }

  loadReplies(thread) {
    let replies = [];
    let thread_replies = this.state.threads[thread._id].replies;
    if (thread_replies) {
        for (let i = 0; i < thread_replies.length; i++) {
            console.log(this.state.threads[thread_replies[i]])
            replies.push(this.loadReply(this.state.threads[thread_replies[i]]));
        }
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
    let adminButton;
    const component = this;
    const userData = this.props.state.user;

    if (userData && userData.isAdmin) {
        adminButton = <button className="deleteBtn" onClick={() => this.deleteThread(thread)}>Delete</button>;
    }
    let replies = thread.replies.map(reply => (<ul>
        <li className="media" id={this.state.threadId + "#" + this.state.threads[reply].id}>
            <div className="media-body">
				<a href={"#"+this.state.threadId+"#"+this.state.threads[reply].id}>Post ID: #{this.state.threads[reply].id}</a><br/>
                {this.state.threads[reply].content.body} <br/>
                {this.loadImage(this.state.threads[reply])} <br/>
                <div>
                    {
                        (function(){
                            if (userData && userData.isAdmin) return (<button className="deleteBtn" onClick={() => component.deleteThread(component.state.threads[reply])}>Delete</button>);
                        })()
                    }
                    <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
                    <div className="hidden">
                        <PostEditor className="replyPostEditor" addPost={this.addReply} thread={this.state.threads[reply]} isReply={true}/>
                    </div>
                </div>
                {this.loadReplies(this.state.threads[reply])}
            </div>
        </li>
    </ul>))

    console.log(replies);
    return(
        <li className="media" id={this.state.threadId + "#" + thread.id}>
          <div className="media-body">
			<a href={"#"+this.state.threadId+"#"+thread.id}>Post ID: #{thread.id}</a>
            <div className ="text-body">{thread.content.body}</div>
            {this.loadImage(thread)} <br/>
            <div>
                {adminButton}
                <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
                <div className="hidden">
                  <PostEditor className="replyPostEditor" addPost={this.addReply} thread={thread} isReply={true}/>
                </div>
            </div>
              {replies}
          </div>
        </li>
    );
  }  

  addReplyToThread(thread, reply) {
      const component = this;
      const data = {
          id: thread._id,
          pid: thread.pid,
          reply: reply._id
      }

    const url = '/threads';

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
          return res.json()
        })
        .then(res => {
            component.getReplies(res)
            setTimeout(function() {
                component.state.threads[thread._id] = res;
            component.getReplies(component.state.threads[component.getThreadId()])}, 1000)
        })
        .catch((error) => {
      console.log(error)
    });

  }

  addReply(newPostBody, newImage, postTitle, thread) {
    console.log("parent thread", thread);
    this.setState({hidden: "hidden"})
    const component = this;
      // add Post to archive
      let imageReference = "";

      if (newImage == null){
      } else {
              imageReference = newImage.name;
      }

    const reply = {
        pid: thread._id,
        author: this.props.state.user.userName,
        replies: [],
        content: {
            title: postTitle,
            body: newPostBody,
            imgRef: imageReference,
        }
    };

      // the URL for the request
      const url = '/create_thread';

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
        }).then (res => {
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
              <PostEditor className="replyPostEditor" addPost={this.addReply} thread={this.state.threads[this.getThreadId()]}
                          isReply={true}/>
            </div>

            {this.loadReplies(this.state.threads[this.getThreadId()])}

          </div>
      );
    } else {
      return null;
    }
  }
}

export default Thread;
