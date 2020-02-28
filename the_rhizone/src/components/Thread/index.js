import React from 'react';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';
import ls from 'local-storage';

class Thread extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      replyNum: 3,
      username: props.state.username,
      loggedIn: props.state.loggedIn
    };

    this.createReply = this.createReply.bind(this);
    this.postReply = this.postReply.bind(this);
  }

  componentWillMount() {
    if (ls.get('loggedIn') !== undefined) {
      this.setState({
        username: ls.get('username'),
        loggedIn: ls.get('loggedIn')
      });
    }
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
    const threadBody = document.querySelector('.threadBody');

    const listElement = document.createElement('li');
    listElement.className = 'media'

    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', "...");
    imgElement.className = 'mr-3';
    imgElement.setAttribute('alt', "...");

    const divElement = document.createElement('div');
    divElement.className = 'media-body';
    divElement.appendChild(document.createTextNode(replyText));
    divElement.appendChild(document.createElement('br'));

    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.onclick = this.createReply;
    button.appendChild(document.createTextNode('Reply'));

    divElement.appendChild(button);

    listElement.appendChild(imgElement);
    listElement.appendChild(divElement);

    threadBody.appendChild(listElement);

    this.state.replyNum++;
  }

  render () {
    return (
      <div>
      <div className="jumbotron text-center">
        <h1><a href="/">The RhiZone</a></h1>
      </div>
      <a href="/settings">My Profile</a>

      <div className='rootPost'>
        <p>Category: Film</p>
        <h2>Some thoughts on the Cats Movie</h2>
        <p>
          First of all, who thought this was a good idea?
          As a fan of the original musical, it saddens me to see how much Hollywood has butchered it.
          The CGI was only the beginning of the problems.
        </p>
      </div>

      <div className='rootReply'>
        <textarea className="form-control" rows="5"></textarea>
        <button className="btn btn-secondary" onClick={this.postReply}>Post Reply To Thread</button>
      </div>

      <div className="threadBody">
        <ul className="list-unstyled">
          <li className="media">
            <img src="..." class="mr-3" alt="..."/>
            <div className="media-body">

              The CGI in the movie has definitely entered uncanny valley. I’ve read T.S. Elliot’s poems which inspired the original musical and really I’m skeptical about the means to which they obtained so many high-profile celebrities to be involved in the project. <br/>
              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
            </div>
          </li>
          <li className="media my-4">
            <img src="..." className="mr-3" alt="..."/>
            <div className="media-body">

              Well the director, Tom Hopper, has had an established career. He made King’s Speech, Les Miserables and The Danish Girl. It’s my assumption that many celebrities wanted to be attached to the project given the clout around Hopper’s name. That said, the film is the perfect example of Freud’s essay on the uncanny. <br/>
              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#reply" onClick={this.createReply} >Reply</button>
            </div>
          </li>
          <li className="media">
            <img src="..." className="mr-3" alt="..."/>
            <div className="media-body">

              Hollywood loves making new works with existing intellectual property. I wish more opportunities were given to emerging screenwriters. <br/>
              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#reply" onClick={this.createReply} >Reply</button>
            </div>
          </li>
        </ul>
      </div>

      </div>
    );
  }
}

export default Thread;
