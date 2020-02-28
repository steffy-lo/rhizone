import React, {} from 'react';
import './PostEditor.css'

class PostEditor extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			newPostBody: '',
			selectedFile: null,
			postTitle: '',
		};
		
		this.handlePostEditorInputChange = this.handlePostEditorInputChange.bind(this);
		this.handlePostEditorInputTitleChange = this.handlePostEditorInputTitleChange.bind(this);
		this.fileChangedHandler = this.fileChangedHandler.bind(this);
		this.createPost = this.createPost.bind(this);
	}

	handlePostEditorInputChange(e) {
		this.setState({
			newPostBody: e.target.value
		});
	}
	
	handlePostEditorInputTitleChange(e) {
		this.setState({
			postTitle: e.target.value
		});
	}
	
	createPost() {
		this.props.addPost(this.state.newPostBody, this.state.selectedFile, this.state.postTitle);
		this.setState({
			newPostBody: '',
			selectedFile: null,
			postTitle: '',
		});
	}
	
	fileChangedHandler = (e) => {
		this.setState({ selectedFile: e.target.files[0] })
	}
	


	render () {
		return (
		<div>
			<div className="panel panel-default post-editor">
				<div className="panel-body form-group">
					 <input type="text" className="form-control" value={this.state.postTitle} onChange={this.handlePostEditorInputTitleChange} />
					<textarea className = "form-control" value={this.state.NewPostBody} onChange={this.handlePostEditorInputChange} />
					<button className = "btn btn-success post-editor-button" onClick={this.createPost}>Post</button>			
					<input type="file" name="file" className = "center-block" onChange={this.fileChangedHandler} />
				</div>
			</div>
			
		</div>
		);
	}
}

export default PostEditor

