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
      username: props.state.username,
      loggedIn: props.state.loggedIn,
      threadId: this.getThreadId()
    };

    this.loadThread = this.loadThread.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.loadReplies = this.loadReplies.bind(this);
    this.createReply = this.createReply.bind(this);
    this.postReply = this.postReply.bind(this);
    this.loadReply = this.loadReply.bind(this);
    this.addReply = this.addReply.bind(this);
    //this.addNestedReply = this.addNestedReply.bind(this);
  }

  getThreadId() {
    return parseInt(window.location.hash.substring(1));
  }

  componentWillMount() {
    if (ls.get('loggedIn') !== undefined) {
      this.setState({
        username: ls.get('username'),
        loggedIn: ls.get('loggedIn')
      });
    }
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
        <h2>{Data.threadData.get(this.state.threadId).content.title}</h2>
        <p>
          {Data.threadData.get(this.state.threadId).content.body}
        </p>
        {this.loadImage(this.state.threadId)}
      </div>
    );
  }

  loadImage(index) {
    if (Data.threadData.get(index) == null || Data.threadData.get(index) === null ){
      return (<img/>);
    } else if (Data.threadData.get(index).content.imgRef == "")
    {
      return (<img/>);
    } else {
      return (
        <img className="threadImage" src={require('./../../images/' + Data.threadData.get(index).content.imgRef)}	 alt="Thread Image" />
      );
    }
  }

  loadReplies() {
    let replies = [];

    for (let i = 0; i < Data.threadData.size; i++) {
      if (Data.threadData.get(i).pid == this.state.threadId) {
        replies.push(this.loadReply(Data.threadData.get(i).content.body, i));
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
    console.log("createReply");
    console.log(e.target.parentElement.lastChild);

    if (this.props.state.loggedIn) {
			const editor = e.target.parentElement.lastChild;
			editor.classList.toggle("hidden");
      // hides the reply button
      editor.previousSibling.classList.toggle("hidden");
		} else {
			window.location.replace('/login');
		}
  }

  postReply(e) {
    const replyText = e.target.parentElement.firstElementChild.value;
    let test = document.createElement('div');
    this.addReply(replyText);
    console.log("test", test);
    console.log(this.loadReply(replyText, null));
  }

  loadReply(replyText, index) {
    return(
      <li className="media" id={index}>
        <div className="media-body">
          {replyText} <br/>
          {this.loadImage(index)} <br/>
          <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
          <div className="hidden">
            <PostEditor className="replyPostEditor" addPost={this.addReply} index={index} isReply={true}/>
          </div>
        </div>
      </li>
    )
  }

  addReply(newPostBody, newImage, postTitle, index) {
    //console(this.props.index);
    console.log("parent id", index);
    //console.log(this.state.threadId);
    const newId = Data.threadData.size;

    if (newImage == null){
		} else {
			// rename newImage to be threadNumber
			// File Upload not supported yet because we need a database to access such files. We only have hardcoded files.
			var new_file = new File([newImage], newId + '.jpg', {type: 'image/jpeg'});
		}

		// add Post to archive
		let imageReference = "";

		if (newImage == null){
		} else {
				imageReference = new_file.name;
		}

    Data.threadData.set(newId, {pid:this.state.threadId, author:"user", replies: [],
        content:{
            title: postTitle,
            body: newPostBody,
            imgRef: imageReference,
        }
    });

    let newReply = Data.threadData.get(newId);
    const replyText = newReply.content.body;

    this.manualCreateReply(replyText, newReply.content.imgRef, index, newId);

  }

  deleteReply(e) {
    console.log("deleteReply");
    console.log(e.target.parentElement.parentElement.parentElement);
    e.target.parentElement.parentElement.parentElement.innerHTML='';
  }

  manualCreateReply(replyText, imgRef, pid, newId) {
    let threadBody;
    let parentReply;
    let ulElement;

    if (Data.threadData.get(pid).pid == -1) {
      threadBody = document.querySelector('.threadBody');
    } else {
      parentReply = document.getElementById(pid.toString());
      console.log(parentReply.querySelector('ul'));
      ulElement = parentReply.querySelector('ul');
      if (ulElement === null) {
        ulElement = document.createElement('ul');
      }
    }

    const listElement = document.createElement('li');
    listElement.className = 'media';
    listElement.setAttribute('id', newId);

    if (imgRef != "") {
      const imgElement = document.createElement('img');
      imgElement.setAttribute('src', imgRef);
      imgElement.className = 'mr-3';
      imgElement.setAttribute('alt', "Reply Image");
      listElement.appendChild(imgElement);
    }

    const divElement = document.createElement('div');
    divElement.className = 'media-body';
    divElement.appendChild(document.createTextNode(replyText));
    divElement.appendChild(document.createElement('br'));

    const button = document.createElement('button');
    button.className = 'replyButton';
    button.onclick = this.createReply;
    button.appendChild(document.createTextNode('Reply'));

    // TODO: how to create a class element????
    const editor = document.createElement('PostEditor');
    editor.className = 'replyPostEditor';

    divElement.appendChild(button);

    const userData = Data.userData.get(this.state.username);
    if (userData.isAdmin){
        const delButton = document.createElement('button');
        delButton.className = 'deleteButton';
        delButton.onclick = this.deleteReply;
        delButton.appendChild(document.createTextNode('Delete'));
        divElement.appendChild(delButton);
    }

    listElement.appendChild(divElement);

    if (Data.threadData.get(pid).pid == -1) {
      threadBody.appendChild(listElement);
    } else {
      ulElement.appendChild(listElement);
      parentReply.appendChild(ulElement);
    }
  }

  render () {
    const replies = this.loadReplies();
    return (
      <div className="threadPage">
      <div className="jumbotron text-center">
        <h1 className="title">The RhiZone</h1>
        <div className="buttons">
          <div className="LinkMeLogin" >
          <Link to={{pathname: '/settings'}}>
            <Button className="settings">Logout</Button>
          </Link>
          </div>
          <div className="LinkMeSettings" >
          <Link to={{pathname: '/settings'}}>
            <Button className="settings">Settings</Button>
          </Link>
          </div>
          <div className="LinkMeInbox" >
            <Link to={{pathname: '/inbox'}}>
              <Button className="inbox">Inbox</Button>
            </Link>
          </div>
          <div className="LinkMeHome" >
            <Link to="/">
              <Button>Home</Button>
            </Link>
        </div>
        </div>
      </div>

      {this.loadThread()}

      <div className='threadReply'>
        <p>Add reply to thread: </p>
        <PostEditor className="replyPostEditor" addPost={this.addReply} index={this.state.threadId} isReply={true}/>
      </div>

      {this.loadReplies()}

      </div>
    );
  }
}

export default Thread;
