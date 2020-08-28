import React from "react";
import {Link, withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {authService} from "../../services/authService";
import {postService} from "../../services/postService";
import './post.css'
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';


class Post extends React.Component {


    constructor(props) {
        super(props);
        this.state = {post: null, loading: true, like: false, likesCount: 0};
        this.params = this.props.match.params;
    }

    componentDidMount() {
        postService
            .getPost(this.params.userId, this.params.postId)
            .then(data => {
                this.setState({post: data, loading: false, like: data.isLiked, likesCount: data.likesCount})
            })
    }

    handleDelete = () => {
        postService.deletePost(this.params.userId, this.params.postId).then(data => {
            this.props.history.push(`/users/${this.params.userId}`);
        }).catch(err => {
            this.props.history.push("/Oh404Page")();
        })
    };

    handleClickLike = () => {
        postService.changeLikeStatus(this.state.post.id, !this.state.like).catch(err => {
            this.props.history.push("/Oh404Page")()
        })
        if (this.state.like) {
            this.setState({
                likesCount: this.state.likesCount - 1,
                like: !this.state.like,
            });
        } else {
            this.setState({
                likesCount: this.state.likesCount + 1,
                like: !this.state.like,
            });
        }
    }

    render() {
        const rendered = !this.state.loading ? <div className="post-item">
            <h1>{this.state.post.title}</h1>

            <img src={this.state.post.imageUrl} alt={this.state.post.title} width="500" height="350"/>
            <p>
                {this.state.post.body}
            </p>
            <ul>
                <li><b>Created by: </b>
                    <Link to={`/users/${this.state.post.userId}`}>
                        {this.state.post.createdBy}
                    </Link>
                </li>
                <li><b>Last Updated: </b> {this.state.post.updatedAt}</li>
            </ul>
            {authService.userLoggedIn() &&
            <IconButton aria-label="like" onClick={this.handleClickLike}>
                {!this.state.like ? <FavoriteBorderSharpIcon/> : <FavoriteSharpIcon color="secondary"/>}
            </IconButton>
            }
            <span>Likes: {this.state.likesCount}</span>
            <br/><br/>
            {this.canEdit() &&
            <Link to={`/users/${this.state.post.userId}/posts/${this.state.post.id}/edit`}>
                <Button variant="contained"> Edit</Button>
            </Link>
            }
            {this.canEdit() &&
            <Button id="delete-button" variant="contained" color="secondary" onClick={this.handleDelete}>Delete
                Post</Button>
            }
        </div> : '';
        return (rendered)

    }

    canEdit() {
        return authService.userLoggedIn() && (authService.currentUser().id === this.state.post.userId);
    }
}

export default withRouter(Post);