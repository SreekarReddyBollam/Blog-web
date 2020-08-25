import React from 'react';
import Registration from "./components/Registration/registration";
import {
    BrowserRouter as Router,
    Route, useHistory,
} from "react-router-dom";
import {Navigation} from "./components/Navigation/navigation";
import AuthService from "./services/authService";
import Post from "./components/Post/post";
import Home from "./components/Home/home";

function App() {
    const authService = new AuthService();
    return (
        <Router>
            <Navigation isLoggedIn={authService.userLoggedIn} user={authService.currentUser}/>
            <Route path="/signup" exact component={() => <Registration mode='signUp'/>}/>
            <Route path="/logout" exact component={Logout}/>
            <Route path="/users/:userId/posts/:postId" exact component={Post}/>
            <Route path="/users/:id/profile" exact component={() => <Registration mode='edit'/>}/>
            <Route path="/users/:userId" exact component={Home}/>
            <Route path="/login" exact component={() => <Registration mode='login'/>}/>
            <Route path="/" exact component={Home}/>
        </Router>
    );
}

function Logout() {
    const authService = new AuthService();
    const history = useHistory();
    authService.logout();
    history.push("/");
    return null;
}

export default App;

