import UrlBuilder from "./urlBuilder";
import AuthService from "./authService";

export default class UserService {
    authService = new AuthService();

    async editProfile(user) {

        const _url = new UrlBuilder().addUsers(this.authService.currentUser().id).build();
        return await this.requestServer(user, _url, 'PUT');
    }

    async requestServer(data, _url, method) {
        try {
            const response = await fetch(_url, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authService.userLoggedIn()?`HS256 ${this.authService.token()}`:''
                }
            })
            return await response.json();
        } catch (err) {
            return err.error;
        }
    }
}