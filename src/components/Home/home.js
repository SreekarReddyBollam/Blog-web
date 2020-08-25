import React from "react";
import PostCard from "../PostCard/postCard";
import './home.css'
import PostService from "../../services/postService";
import {withRouter} from "react-router-dom";

class Home extends React.Component {
    postService = new PostService();

    constructor(props) {
        super(props);
        this.state = {posts: null};
    }

    componentDidMount() {
        const params = this.props.match.params;
        this.postService
            .getPosts(params.userId)
            .then(data => {
                this.setState({posts: data})
                if (this.state.posts.error) {
                    // TODO route to 404 page
                }
            })
    }

    render() {
        const posts = this.state.posts ?
            this.state.posts.map(element => <PostCard post={element} user_id={element.userId}/>) : null
        return (
            <div className="hero">
                <div className="heading">
                    <h2>Posts</h2>
                </div>
                <div className="posts">
                    {posts}
                </div>
            </div>
        )
    }
}
export default withRouter(Home);