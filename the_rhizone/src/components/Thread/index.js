import React from 'react';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';
import ls from 'local-storage';
import * as Data from './../../data/hardcoded.js';
import './style.css';

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
  }

  getThreadId() {
    // TODO: Add error handling for when there's an invalid or no thread id
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
    console.log(e.target.parentElement);

    const divElement = document.createElement('div');

    const textBox = document.createElement('textarea');
    textBox.className = 'form-control';
    textBox.setAttribute('rows', 5);

    const postButton = document.createElement('button');
    postButton.className = 'btn btn-secondary';
    postButton.onclick = this.postReply;
    postButton.appendChild(document.createTextNode('Post Reply'))

    divElement.appendChild(textBox);
    divElement.appendChild(postButton);

    e.target.parentElement.insertBefore(divElement, e.target.nextSibling);
  }

  postReply(e) {
    const replyText = e.target.parentElement.firstElementChild.value;
    let test = document.createElement('div');
    console.log("test", test);
    console.log(this.loadReply(replyText, null));
  }

  loadReply(replyText, index) {
    return(
      <li className="media">
        <div className="media-body">
          {replyText} <br/>
          {this.loadImage(index)} <br/>
          <button type="button" className="replyButton" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
        </div>
      </li>
    )
  }

  render () {
    const replies = this.loadReplies();
    return (
      <div className="threadPage">
      <div className="jumbotron text-center">
        <h1><a href="/">The RhiZone</a></h1>
      </div>
      <a href="/settings">Settings</a><br/>
      <a href="/inbox">Inbox</a>

      {this.loadThread()}

      <div className='threadReply'>
        <textarea className="form-control" rows="5"></textarea>
        <button className="btn btn-secondary" onClick={this.postReply}>Post Reply To Thread</button>
      </div>

      {this.loadReplies()}

      </div>
    );
  }
}

export default Thread;
