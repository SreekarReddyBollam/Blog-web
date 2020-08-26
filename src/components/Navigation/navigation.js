import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import React from "react";
import {Link, Route, Redirect, withRouter, Switch} from "react-router-dom";
import './navigtion.css';
import Registration from "../Registration/registration";
import Post from "../Post/post";
import Home from "../Home/home";
import {authService} from "../../services/authService";
import PostRegister from "../Post/postRegister";
import FourOhFour from "../404/404";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import {AccountCircle} from "@material-ui/icons";

class Navigation extends React.Component {
    logoutButton = <Link to="/logout"><Button id="button-signup">Logout</Button></Link>;
    signUpButton = <Link to="/signup"><Button id="button-signup">SignUp</Button></Link>;
    loginButton = <Link to="/login"><Button id="button-login">Login</Button></Link>;
    allPosts = <Link to="/"><Button id="button-posts">All Posts</Button></Link>;

    isLoggedIn = authService.userLoggedIn;
    user = authService.currentUser;

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false
        }
    }

    handleMenu = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        });
    };
    resetAnchor = () => {
        this.setState({
            anchorEl: null,
            open: false
        });
    }
    handleClose = (event) => {
        this.resetAnchor();
    };
    handleClickProfile = (event) => {
        this.resetAnchor();
        this.props.history.push(`/users/${this.user().id}/profile`);
    }
    handleClickLogout = (event) => {
        this.resetAnchor();
        this.props.history.push(`/logout`);
    }

    render() {
        if (this.isLoggedIn()) {
            this.profile =
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClickProfile}>Profile</MenuItem>
                        <MenuItem onClick={this.handleClickLogout}>Logout</MenuItem>
                    </Menu>
                </div>

            this.wellComeText = <Link to={`/users/${this.user().id}`}>
                <Button id="button-feed"> Your Feed</Button>
            </Link>;
        }
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        {this.isLoggedIn() && this.profile}
                        {!this.isLoggedIn() && this.signUpButton}
                        {!this.isLoggedIn() && this.loginButton}
                        {this.allPosts}
                        {this.isLoggedIn() && this.wellComeText}
                    </Toolbar>
                </AppBar>

                <Switch>
                    <Route path="/login" exact component={() => <Registration mode='login'/>}/>
                    <Route path="/signup" exact component={() => <Registration mode='signUp'/>}/>
                    <Route path="/logout" exact component={() => {
                        authService.logout();
                        return <Redirect to="/"/>
                    }}/>
                    <Route path="/Oh404Page" exact component={FourOhFour}/>

                    <Route path="/users/:userId/posts/create" exact component={() => <PostRegister mode='create'/>}/>

                    <Route path="/users/:userId/posts/:postId/edit" exact
                           component={() => <PostRegister mode='edit'/>}/>

                    <Route path="/users/:userId/posts/:postId" exact component={Post}/>

                    <Route path="/users/:userId" exact component={Home}/>

                    <Route path="/users/:userId/profile" exact component={() => <Registration mode='edit'/>}/>

                    <Route path="/" exact component={Home}/>
                </Switch>

            </div>
        )
    }
}

export default withRouter(Navigation);


export function goTo404() {
    return (
        <Redirect to="/Oh404Page"/>
    )
}
