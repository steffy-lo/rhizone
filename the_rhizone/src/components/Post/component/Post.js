import React from "react";
import './Post.css';

const Post = (props) => (
        <div class="col-4 card">
		<img class="card-img-top" src={require('./leorangeman.jpg')} alt="Card image" />
		<p class="preview card-text text-sm-left text-monospace card-img-overlay">
		{props.postBody}
		</p>
		</div>

// <div className="panel panel-default">
	//		<div className="panel-body">
		//		{props.postBody }
		//	</div>
//</div>
)

export default Post;