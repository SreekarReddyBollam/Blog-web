export const DOMAIN = "http://localhost:8080"

export default class UrlBuilder {

    constructor() {
        this.url = DOMAIN;
    }

    addUsers(userId) {
        this.url += `/users/`;
        this.url += userId ? userId : '';
        return this;
    }

    forLogin() {
        this.url += '/login';
        return this;
    }

    forSignUp() {
        this.url += '/signup';
        return this;
    }

    build() {
        return this.url;
    }

    addPosts(postId) {
        this.url += `/posts/`;
        this.url += postId ? postId : '';
        return this;
    }

    addLogout() {
        this.url += '/logout';
        return this;
    }

    addLikeStatus(statusLike){

       this.url += `/${statusLike?'like':'unlike'}`;
       return this;
    }
}