import PostRepository from "../repository/PostRepository"

class PostService {
    
    constructor() {
    }
    async createPost(text:string,userid:string,status:number) {
        try {
            let newPost = await PostRepository.create({text,userid,status});
            
            return newPost
        } catch (error) {
            throw Error(`${error}`)
        }
    }
    async findOne( id: string) {
        let post = await PostRepository.findById(id);
        return post
    }
    async deletePost(id:string) {
        let post = await PostRepository.destroy(id);
        return post
    }

    async updateStatusPost(id:string, status: number) {
        let update = await PostRepository.UpdateOne({_id:id}, {status:status})

        return update
    }
    async updatePost(id:string, text:string, status:number) {
        let update = await PostRepository.UpdateOne({_id:id}, {text:text,status:status})

        return update
    }
}

export default PostService