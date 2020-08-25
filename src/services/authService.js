import UrlBuilder from "./urlBuilder";
class AuthService {
    async login(user) {
        const _url = new UrlBuilder().forLogin().build();
        return await this.requestServer(user, _url);
    }

    logout = () => {
        document.cookie = 'token=ANY;max-age=0';
        document.cookie = 'user=ANY;max-age=0';
    }

    userLoggedIn = () => {
        return !!this.token();
    }

    token = () => {
        return retrieveCookie('token');
    }

    currentUser = () => {
        return this.userLoggedIn() ? JSON.parse(retrieveCookie('user')): null;
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
                'Authorization': `HS256 ${this.token()}`
            }
        })
        const body = await response.json();
        if (!!body.meta && body.meta['token']) {
            document.cookie = `token=${body.meta['token']};max-age=3600`;
            document.cookie = `user=${JSON.stringify(body['user'])};max-age=3600`;
        }
        return body;
    }

}

export const authService = new AuthService();

export function retrieveCookie(name) {
    let cookies = document.cookie.split("; ");
    let keyValue = cookies.filter(cookie => cookie.split('=')[0] === name);
    let cookie = '';
    if(keyValue.length===1){
        keyValue = keyValue[0];
        if(keyValue.split("=").length>2){
            cookie = keyValue.split("=").splice(1,).join();
        }
        else
            cookie = keyValue.split("=")[1];
    }

    return cookie;
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