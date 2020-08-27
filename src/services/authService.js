import UrlBuilder from "./urlBuilder";
import * as Cookies from 'js-cookie';

const jwtDecode = require('jwt-decode');


class AuthService {

    login(user) {
        const _url = new UrlBuilder().forLogin().build();
        return this.requestServer(user, _url);
    }

    logout = () => {
        const _url = new UrlBuilder().addLogout().build();
        Cookies.remove('token');
        return this.requestServer(null, _url, 'GET');
    }

    userLoggedIn = () => {
        return !!this.token();
    }

    token = () => {
        return Cookies.get('token');
    }

    currentUser = () => {
        let user;
        if (this.userLoggedIn()) {
            const jwt = this.token();
            user = jwtDecode(jwt);
        }
        return user;
    }

    signUp(user) {
        user = formatConversion(user, camelToSnakeCase);
        const _url = new UrlBuilder().forSignUp().build();
        return this.requestServer(user, _url)
    }

    async requestServer(data, _url, method = 'POST') {
        let options = {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        if(method!=='GET')
            options.body =  JSON.stringify(data)

        const response = await fetch(_url, options)

        if (!response.ok) {
            const body = await response.json();
            throw new Error(JSON.stringify(body.error))
        }

        const body = await response.json();

        if (!!body.meta && body.meta['token']) {
            sessionStorage['user'] = JSON.stringify(body['user']);
        }
        return body;
    }

}

export const authService = new AuthService();


export function formatConversion(object) {
    let result = {};
    for (const property in object) {
        if (object.hasOwnProperty(property)) {
            result[camelToSnakeCase(property)] = object[property];
        }
    }
    return result
}


export function camelToSnakeCase(key) {
    let result = key.replace(/([A-Z])/g, " $1");
    return result.split(' ').join('_').toLowerCase();
}