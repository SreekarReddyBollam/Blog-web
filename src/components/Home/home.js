import React from "react";
import PostCard from "../PostCard/postCard";
import './home.css'
import {withRouter} from "react-router-dom";
import {postService} from "../../services/postService";
import {authService} from "../../services/authService";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom"

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {posts: []};
    }

    componentDidMount() {
        const params = this.props.match.params;
        this.requestForPosts(params.userId);
    }

    componentDidUpdate(prevProps) {

        const params = this.props.match.params;

        if(prevProps.match.params.userId !== params.userId){
            this.requestForPosts(params.userId);
        }

    }

    requestForPosts(userId){
        postService.getPosts(userId).then(data=>{
            this.setState({
                posts:data
            });
        }).catch(err=>{
            // TODO -- go to 404
        })

    }


    render() {
        const posts = this.state.posts.map(element => <PostCard post={element} user_id={element.userId}/>);
        return (posts.length > 0 &&
                    <div className="hero">
                        <div className="heading">
                            <h2>{`Posts by ${this.getUsername()}`}</h2>
                            { this.shouldCreateButtonVisible() &&
                                <Link to={`/users/${authService.currentUser().id}/posts/create`}>
                                    <Button variant="contained">Create new Post</Button>
                                </Link>
                            }
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

    shouldCreateButtonVisible(){
        const params = this.props.match.params;

        return authService.userLoggedIn() && (authService.currentUser().id === Number(params.userId));
    }
}

export default withRouter(Home);