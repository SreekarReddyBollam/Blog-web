import UrlBuilder from "./urlBuilder";
import {authService} from "./authService";

class UserService {

    async editProfile(user) {

        const _url = new UrlBuilder().addUsers(authService.currentUser().id).build();
        return await this.requestServer(user, _url, 'PUT');
    }

    async deleteUser(id) {
        const _url = new UrlBuilder().addUsers(id).build();
        return await this.requestServer(null, _url, 'DELETE');
    }

    async requestServer(data = null, _url, method) {
        const response = await fetch(_url, {
            method: method,
            body: data ? JSON.stringify(data) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authService.userLoggedIn() ? `HS256 ${authService.token()}` : ''
            }
        })
        if(!response.ok){
            return new Error("404 Error server might be down");
        }
        return await response.json();
    }
}

export const userService = new UserService();

