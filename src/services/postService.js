import UrlBuilder from "./urlBuilder";
import {authService, camelToSnakeCase, formatConversion} from "./authService";

class PostService {


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

    async editPost(userId, postId, body) {
        const _url = new UrlBuilder()
            .addUsers(userId)
            .addPosts(postId)
            .build();
        const response = await this.requestServer(_url, 'PUT', body);
        return response.post;
    }

    async createPost(userId,body) {
        const _url = new UrlBuilder().addUsers(userId).addPosts().build();
        const response = await this.requestServer(_url, 'POST',body);
        return response.post;
    }

    async deletePost(userId,postId){
        const _url = new UrlBuilder().addUsers(userId).addPosts(postId).build();
        return await this.requestServer(_url, 'DELETE');
    }

    async requestServer(_url, method, body) {
        try{
            let options = {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HS256 ${authService.token()}`
                },
            }
            if(body)
                options['body'] =JSON.stringify(formatConversion(body,camelToSnakeCase));

            const response = await fetch(_url,options)

            return await response.json();
        }
        catch (err){
            throw new Error("Network error");
        }
    }

    async changeLikeStatus(id, statusLike) {
        const _url = new UrlBuilder().addUsers(authService.currentUser().id)
            .addPosts(id).addLikeStatus(statusLike).build();
        return await this.requestServer(_url,'GET');
    }
}

export const postService = new PostService();