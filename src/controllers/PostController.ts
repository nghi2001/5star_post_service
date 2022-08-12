import { Request, Response } from 'express'
import PostService from '../services/PostService';
class PostController {
    private PostService: PostService
    constructor() {
        this.PostService = new PostService();
    }

    async find(req: Request, res: Response) {
        try {
            let id = req.params.id;
            let post = await this.PostService.findOne(id);
            return res.status(200).json(post)
        } catch (error) {
            console.log(error);
            res.json(error)
        }
    }

    async create(req: Request,res: Response) {
        try {
            let {text,userId,status} = req.body;
            let newPost = await this.PostService.createPost(text,userId,status);
            return res.status(200).json(newPost)
        } catch (error) {
            console.log(error);
            res.json('loi')
        }
    }

    async destroy( req: Request, res: Response) {
        try {
            let {id} = req.body;
            let deletePost = await this.PostService.deletePost(id);
            return res.status(200).json(deletePost)
        } catch (error) {
            console.log(error);
            res.json('loi')
        }
    }

    async update( req:Request, res: Response) {
        try {
            let {id, text, status} = req.body;
            let post = await this.PostService.updatePost(id,text, status);
            return res.status(200).json(true)
        } catch (error) {
            console.log(error);
            res.json('loi')
        }
    }

    async updateStatus( req: Request, res: Response) {
        try {
            let {id, status} = req.body;
            let post = await this.PostService.updateStatusPost(id, status);
            return res.status(200).json(post)
        } catch (error) {
            console.log(error);
            res.json('loi')
        }
    }
}

export default new PostController()