import UrlBuilder from "./urlBuilder";

export default class AuthService {
    async login(user) {
        const _url = new UrlBuilder().forLogin().build();
        return await this.requestServer(user, _url);
    }

    logout = () => {
        sessionStorage.clear()
    }

    userLoggedIn = () => {
        return !!sessionStorage['token'];
    }

    token = () => {
        return sessionStorage['token'];
    }

    currentUser = () => {
        return this.userLoggedIn() ? JSON.parse(sessionStorage['user']) : null;
    }

    async signUp(user) {
        user = formatConversion(user);
        const _url = new UrlBuilder().forSignUp().build();
        return await this.requestServer(user, _url)
    }

    async requestServer(data, _url, method = 'POST') {
        const response = await fetch(_url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HS256 ${sessionStorage['token']}`
            }
        })
        const body = await response.json();
        if (!!body.meta && body.meta['token']) {
            sessionStorage['token'] = body.meta['token'];
            sessionStorage['user'] = JSON.stringify(body['user']);
        }
        return body;
    }

}


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