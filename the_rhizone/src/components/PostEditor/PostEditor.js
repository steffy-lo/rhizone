import React, {} from 'react';
import './PostEditor.css';
import SimpleReactValidator from 'simple-react-validator';

class PostEditor extends React.Component {

	constructor(props) {
		super(props);

		this.validator = new SimpleReactValidator();

		this.state = {
			newPostBody: '',
			selectedFile: null,
			postTitle: '',
			hidden: '',
			message: ''
		};

		this.handlePostEditorInputChange = this.handlePostEditorInputChange.bind(this);
		this.handlePostEditorInputTitleChange = this.handlePostEditorInputTitleChange.bind(this);
		this.fileChangedHandler = this.fileChangedHandler.bind(this);
		this.createPost = this.createPost.bind(this);
	}

	// To create a post, we check if it is a valid post first (i.e if it is over 150 characters)
	// Then we set the states the the post's body, title and selected image
	createPost(form) {
		 if (this.validator.fieldValid('NewPostBody')) {
		 	let imageData = new FormData(form);
		 	if (this.state.selectedFile == null) {
		 		imageData = null;
			}
		 	this.props.addPost(this, this.state.newPostBody.replace(/n /g, "<br>"), imageData, this.state.postTitle, this.props.thread);
			this.setState({
				newPostBody: '',
				selectedFile: null,
				postTitle: ''
			});
			if (typeof this.props.thread != "undefined" && this.props.thread.pid != -1) {
				this.setState({hidden: "hidden"})
			}
			if (this.state.selectedFile != null) {
				this.setState({message: "Uploading image... Please wait."})
			}

		} else {
		this.validator.showMessages();
		this.forceUpdate();
		}
	}

	// This file handler is for file upload
	fileChangedHandler = (e) => {
		this.setState({ selectedFile: e.target.files[0] })
	}

	// This file handler is for post titles
	handlePostEditorInputTitleChange(e) {
		this.setState({
			postTitle: e.target.value
		});
	}

	// This handler is for post body changes
	handlePostEditorInputChange(e) {
		this.setState({
			newPostBody: e.target.value
		});
	}
	render () {
		let hideTitle;
		if (this.props.isReply) {
			hideTitle = "hidden";
		} else {
			hideTitle = "form-control";
		}
		
		
		return (
		<div className={this.state.hidden}>
			<div className="panel panel-default post-editor">
				<div className="panel-body form-group">
					 <input type="text" className={hideTitle} value={this.state.postTitle} onChange={this.handlePostEditorInputTitleChange} placeholder="Thread Title"/>
					<textarea id ='const'className = "form-control" value={this.state.newPostBody} onChange={this.handlePostEditorInputChange} placeholder="Type your thoughts here..."/>
					 {this.validator.message('NewPostBody', this.state.newPostBody, 'required|min:150|max:4000')}
					<form className="image-form" onSubmit={(e) => {
						e.preventDefault();
						this.createPost(e.target);
					}}>
					 <button className = "btn btn-success post-editor-button" type="submit">Post</button>
					<input type="file" name="file" className = "center-block" onChange={this.fileChangedHandler} />
					</form>
					<h3>{this.state.message}</h3>
				</div>
			</div>
		</div>
		);
	}
}

export default PostEditor
