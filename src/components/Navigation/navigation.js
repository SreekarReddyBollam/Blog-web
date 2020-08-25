import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import React from "react";
import {Link, Route, Redirect, withRouter} from "react-router-dom";
import './navigtion.css';
import Registration from "../Registration/registration";
import Post from "../Post/post";
import Home from "../Home/home";
import AuthService from "../../services/authService";

class Navigation extends React.Component {
    logoutButton = <Link to="/logout"><Button id="button-signup">Logout</Button></Link>;
    signUpButton = <Link to="/signup"><Button id="button-signup">SignUp</Button></Link>;
    loginButton = <Link to="/login"><Button id="button-login">Login</Button></Link>;
    allPosts = <Link to="/"><Button id="button-posts">All Posts</Button></Link>;
    authService = new AuthService();

    isLoggedIn = this.authService.userLoggedIn;
    user = this.authService.currentUser;

    render() {
        if (this.isLoggedIn()) {
            this.profileButton = <Link to={`/users/${this.user().id}/profile`}>
                <Button id="button-signup">Profile</Button>
            </Link>;
            this.wellComeText = <Link to={`/users/${this.user().id}`}>
                <Button id="button-feed"> Your Feed</Button>
            </Link>;
        }
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        {this.isLoggedIn() && this.profileButton}
                        {this.isLoggedIn() && this.logoutButton}
                        {!this.isLoggedIn() && this.signUpButton}
                        {!this.isLoggedIn() && this.loginButton}
                        {this.allPosts}
                        {this.isLoggedIn() && this.wellComeText}
                    </Toolbar>
                </AppBar>

                <Route path="/login" exact component={() => <Registration mode='login'/>}/>
                <Route path="/signup" exact component={() => <Registration mode='signUp'/>}/>
                <Route path="/logout" exact component={() => {
                    new AuthService().logout();
                   return <Redirect to="/" />
                }}/>

                <Route path="/users/:userId" exact component={Home}/>
                <Route path="/users/:userId/profile" exact component={() => <Registration mode='edit'/>}/>

                <Route path="/users/:userId/posts/:postId" exact component={Post}/>
                <Route path="/users/:userId/posts/create" exact component={Post}/>
                <Route path="/users/:userId/posts/:postId/edit" exact component={Post}/>

                <Route path="/" exact component={Home}/>

            </div>
        )
    }
}
export default withRouter(Navigation);
