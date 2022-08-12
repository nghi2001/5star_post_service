import PostModel from "../models/PostModel"
class PostRepository {
    
    constructor() {
        // this.model = PostModel
    }
    async create(post:any) {
        try{
            let newPost = new PostModel();
            newPost.text = post.text;
            newPost.userId = post.userid;
            newPost.status = post.status;

            newPost = await newPost.save();
            return newPost
        } catch(err) {
            throw Error(`${err}`)
        }
    }

    async destroy(id:string) {
        try {
            let post = await PostModel.findByIdAndDelete(id);
            return post
        } catch (error) {
            throw Error(`${error}`)
        }
    }
    async UpdateOne(filter:any, update:any) {
        let result = await PostModel.findOneAndUpdate(filter,update)
        return result
    }
    async findById(filter:any) {
        let result = await PostModel.findById(filter);
        return result
    }
}

export default new PostRepository()