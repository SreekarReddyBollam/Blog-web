import UrlBuilder from "./urlBuilder";
import {authService} from "./authService";

class UserService {

    async editProfile(user) {

        const _url = new UrlBuilder().addUsers(authService.currentUser().id).build();
        return this.requestServer(user, _url, 'PUT');
    }

    async deleteUser(id) {
        const _url = new UrlBuilder().addUsers(id).build();
        await this.requestServer(null, _url, 'DELETE');
        return await authService.logout()
    }

    async getUser(id){
        const _url = new UrlBuilder().addUsers(id).build();
        const response = await this.requestServer(null, _url, 'GET');
        return response.user;
    }

    async requestServer(data = null, _url, method) {
        let options = {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authService.userLoggedIn() ? `HS256 ${authService.token()}` : ''
            }
        }
        if(method!=='GET')
            options.body =data ? JSON.stringify(data) : ''

        const response = await fetch(_url,options)

        if(!response.ok){
            return new Error("404 Error server might be down");
        }
        return await response.json();
    }
}

export const userService = new UserService();

