import React from "react";
import {postService} from "../../services/postService";
import {withRouter} from "react-router-dom";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import './postRegister.css'

class PostRegister extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
            imageUrl: '',
            isTitleValid: true
        };
    }

    componentDidMount() {
        const params = this.props.match.params;
        this.setState({
            title: '',
            body: '',
            imageUrl: '',
            isTitleValid: true
        })
        if (this.props.mode === 'edit')
            this.requestForPost(params.userId, params.postId);
    }

    componentDidUpdate(prevProps) {
        const params = this.props.match.params;
        if (this.props.mode === 'edit' && prevProps.match.params.postId !== params.postId) {
            this.requestForPost(params.userId, params.postId);
        }
    }

    requestForPost(userId, postId) {
        postService.getPost(userId, postId).then(
            data => {
                this.setState({
                    title: data.title,
                    body: data.body,
                    imageUrl: data.imageUrl
                })
            }
        )
    }

    handleOnChange(inputName) {
        return (event) => {
            this.setState({
                [inputName]: event.target.value,
            });
        }
    }

    handleOnChangeTitle = (event) => {
        this.setState({
            title: event.target.value,
            isTitleValid: event.target.value.trim() !== ''
        })
    }

    handlePublish =  () => {
        const params = this.props.match.params;

        if (this.props.mode === 'edit') {
            postService.editPost(params.userId, params.postId, {
                title: this.state.title,
                body: this.state.body,
                imageUrl: this.state.imageUrl
            }).then(data=>{
                this.props.history.push(`/users/${params.userId}`);
            }).catch(err=>{
                // TODO - route to 404 page
            });
        } else if (this.props.mode === 'create') {
            postService.createPost(params.userId, {
                title: this.state.title,
                body: this.state.body,
                imageUrl: this.state.imageUrl
            }).then(data=>{
                this.props.history.push(`/users/${params.userId}`);
            }).catch(err=>{
                // TODO - route to 404 page
            });
        }
    }


    render() {
        const textBoxTitle = <TextField id="title" label="Title" variant="outlined" value={this.state.title}
                                        helperText={!this.state.isTitleValid ? "Title is required" : ""}
                                        error={!this.state.isTitleValid}
                                        required onChange={this.handleOnChangeTitle}/>;
        const textBoxImageUrl = <TextField id="imageUrl" label="Image link" variant="outlined"
                                           value={this.state.imageUrl}
                                           helperText="insert link"
                                           onChange={this.handleOnChange('imageUrl')}/>;

        const textAreaBody = <TextField id="body" variant="outlined"
                                        multiline rows={10} value={this.state.body}
                                        onChange={this.handleOnChange('body')}/>;

        const publishButton = <Button variant="contained" onClick={this.handlePublish}>Publish</Button>;

        const heading = this.props.mode === 'edit' ? <h1>Editing Post</h1> : <h1>Creating New Post</h1>

        const rendered =
            [heading,
                textBoxTitle,
                textAreaBody,
                textBoxImageUrl,
                publishButton];

        return (
            <div className="register-post">
                {rendered}
            </div>

        )
    }
}

export default withRouter(PostRegister);