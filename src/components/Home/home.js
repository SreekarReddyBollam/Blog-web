import React from "react";
import PostCard from "../PostCard/postCard";
import './home.css'
import {withRouter} from "react-router-dom";
import {postService} from "../../services/postService";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: []};
    }

    componentDidMount() {
        const params = this.props.match.params;
        postService
            .getPosts(params.userId)
            .then(data => {
                this.setState({posts: data})
                if (this.state.posts.error) {
                    // TODO route to 404 page
                }
            })
    }

    render() {
        const posts = this.state.posts.map(element => <PostCard post={element} user_id={element.userId}/>);
        return (posts.length > 0 &&
                    <div className="hero">
                        <div className="heading">
                            <h2>{`Posts by ${this.getUsername()}`}</h2>
                        </div>
                        <div className="posts">
                            {posts}
                        </div>
                    </div>

        )
    }

    getUsername() {
        let pathName = this.props.location.pathname;
        if(pathName==="/")
            return "All";
        return this.state.posts[0].createdBy;
    }
}

export default withRouter(Home);