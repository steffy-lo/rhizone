import React, {} from 'react';
import './PostEditor.css'
import SimpleReactValidator from 'simple-react-validator';


class PostEditor extends React.Component {

	constructor(props) {
		super(props);
		
		this.validator = new SimpleReactValidator();

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
		 if (this.validator.fieldValid('NewPostBody')) {
			 this.props.addPost(this.state.newPostBody, this.state.selectedFile, this.state.postTitle);
			this.setState({
			newPostBody: '',
			selectedFile: null,
			postTitle: '',
			});
		} else {
		this.validator.showMessages();
		this.forceUpdate();
		}
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
					<textarea className = "form-control" value={this.state.newPostBody} onChange={this.handlePostEditorInputChange} />
					 {this.validator.message('NewPostBody', this.state.newPostBody, 'required|min:150|max:4000')}
					<button className = "btn btn-success post-editor-button" onClick={this.createPost}>Post</button>			
					<input type="file" name="file" className = "center-block" onChange={this.fileChangedHandler} />
				</div>
			</div>
			
		</div>
		);
	}
}

export default PostEditor

