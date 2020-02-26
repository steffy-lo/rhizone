import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';

class Thread extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      replyNum: 3
    };

    this.createReply = this.createReply.bind(this);
    this.postReply = this.postReply.bind(this);
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
        <h2>Thread Title</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div className='rootReply'>
        <textarea class="form-control" rows="5"></textarea>
        <button class="btn btn-secondary" onClick={this.postReply}>Post Reply To Thread</button>
      </div>

      <div className="threadBody">
        <ul class="list-unstyled">
          <li class="media">
            <img src="..." class="mr-3" alt="..."/>
            <div class="media-body">

              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. <br/>
              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#reply" onClick={this.createReply}>Reply</button>
            </div>
          </li>
          <li class="media my-4">
            <img src="..." class="mr-3" alt="..."/>
            <div class="media-body">

              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. <br/>
              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#reply" onClick={this.createReply} >Reply</button>
            </div>
          </li>
          <li class="media">
            <img src="..." class="mr-3" alt="..."/>
            <div class="media-body">

              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. <br/>
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
