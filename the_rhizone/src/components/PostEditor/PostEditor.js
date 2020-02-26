import React, {Component} from 'react';
import './PostEditor.css'

class PostEditor extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			newPostBody: '',
			selectedFile: null,
		};
		
		this.handlePostEditorInputChange = this.handlePostEditorInputChange.bind(this);
		this.fileChangedHandler = this.fileChangedHandler.bind(this);
		this.createPost = this.createPost.bind(this);
	}

	handlePostEditorInputChange(e) {
		this.setState({
			newPostBody: e.target.value
		});
	}
	
	createPost() {
		this.props.addPost(this.state.newPostBody, this.state.selectedFile);
		this.setState({
			newPostBody: '',
			selectedFile: null
		});
	}
	
	fileChangedHandler = (e) => {
		this.setState({ selectedFile: e.target.files[0] })
	}
	


	render () {
		return (
		<div>
			<div className="panel panel-default post-editor">
				<div className="panel-body">
					<textarea className = "form-control post-editor-input" value={this.state.NewPostBody} onChange={this.handlePostEditorInputChange} />
					<button className = "btn btn-success post-editor-button" onClick={this.createPost}>Post</button>
				</div>
			</div>
			
			<input type="file" name="file" className = "center-block" onChange={this.fileChangedHandler} />
		</div>
		);
	}
}

export default PostEditor

