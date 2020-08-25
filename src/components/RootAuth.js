import React from 'react';
import { Navigation } from "./Navigation/navigation";
import AuthService from "../services/authService";
import Registration from "./Registration/registration";
import Home from "./Home/home";

class RootAuth extends React.PureComponent {
    constructor(props) {
        super(props);
        this.authService = new AuthService();
    }

    render () {
        const isLoggedIn = this.authService.userLoggedIn();
        return (
            <div>
                <Navigation isLoggedIn={this.authService.userLoggedIn} user={this.authService.currentUser} />
                {isLoggedIn ? <Registration mode='login'/> : <Home />}
            </div>
        )
    }

}

export default RootAuth;