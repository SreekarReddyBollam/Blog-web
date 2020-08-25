import React from "react";
import PostService from "../../services/postService";
import {Link, withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/authService";

class Post extends React.Component {


    constructor(props) {
        super(props);
        this.state = {post: null, loading: true};
        this.postService = new PostService();
        this.authService = new AuthService();
        this.params = this.props.match.params;
    }

    componentDidMount() {
        this.postService
            .getPost(this.params.userId, this.params.postId)
            .then(data => {
                this.setState({post: data, loading: false})
                console.log(this.state.post);
                if (this.state.post.error) {
                    // TODO route to 404 page
                }
            })
    }

    render() {
        const rendered = !this.state.loading ? <div className="hero">
            <h1>{this.state.post.title}</h1>

            <img src={this.state.post.imageUrl} alt={this.state.post.title} width="500" height="350"/>
            <p>
                {this.state.post.body}
            </p>
            <ul>
                <li><b>Like Count: </b> {this.state.post.likesCount}</li>
                <li><b>Created by: </b>
                    <Link to={`/users/${this.state.post.userId}`}>
                        {this.state.post.createdBy}
                    </Link>
                </li>
                <li><b>Last Updated: </b> {this.state.post.updatedAt}</li>
            </ul>
            { this.canEdit() &&
                <Link to={`/users/${this.state.post.userId}/posts/${this.state.post.id}/edit`}>
                    <Button variant="contained"> Edit</Button>
                </Link>
            }
        </div> : '';
        return (rendered)

    }
    canEdit(){
        return this.authService.currentUser() && (this.authService.currentUser().id === this.state.post.userId);
    }
}

export default withRouter(Post);