import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import React from "react";
import {Link} from "react-router-dom";
import './navigtion.css';

export class Navigation extends React.Component {
    logoutButton = <Link to="/logout"><Button id="button-signup">Logout</Button></Link>;
    signUpButton = <Link to="/signup"><Button id="button-signup">SignUp</Button></Link>;
    loginButton = <Link to="/login"><Button id="button-login">Login</Button></Link>;
    allPosts = <Link to="/"><Button id="button-posts">All Posts</Button></Link>;
    isLoggedIn = this.props.isLoggedIn;
    user = this.props.user;

    render() {
        if (this.isLoggedIn()) {
            this.profileButton = <Link to={`/users/${this.user().username}/profile`}>
                <Button id="button-signup">Profile</Button>
            </Link>;
            this.wellComeText = <Link to={`/users/${this.user().id}`}>
                <Button id="button-feed"> Your Feed</Button>
            </Link>;
        }
        return (
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
        )
    }
}