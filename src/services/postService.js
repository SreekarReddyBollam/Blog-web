import UrlBuilder from "./urlBuilder";
import AuthService from "./authService";

export default class PostService {

    authService = new AuthService();

    async getPost(userId, postId) {
        const _url = new UrlBuilder()
            .addUsers(userId)
            .addPosts(postId)
            .build();
        const response = await this.requestServer(_url, 'GET');
        return response.post;
    }

    async getPosts(userId) {
        let _url;
        if (!userId)
            _url = new UrlBuilder()
                .addPosts()
                .build();
        else
            _url = new UrlBuilder()
                .addUsers(userId)
                .addPosts().build();

        const response = await this.requestServer(_url, 'GET');
        return response.posts;
    }

    async editPost(userId, postId) {
        const _url = new UrlBuilder()
            .addUsers(userId)
            .addPosts(postId)
            .build();
        const response = await this.requestServer(_url, 'PUT');
        return response.post;
    }

    async createPost(userId) {
        const _url = new UrlBuilder().addUsers(userId).addPosts();
        const response = await this.requestServer(_url, 'POST');
        return response.post;
    }

    async requestServer(_url, method) {
        const response = await fetch(_url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HS256 ${sessionStorage['token']}`
            }
        })
        return await response.json();
    }
}