import Express from 'express';
const router = Express.Router();
import { validate } from 'express-validation';
import { DeletePostValidation,
        updatePostValidation,
        updateStatusValidation
} from '../helper/PostValidation';
import PostController from '../controllers/PostController';
import PostValidation from '../helper/PostValidation';

// router.post('/post',validate(PostValidation),PostController.create.bind(PostController))
router.get('/post/user/:id', PostController.show.bind(PostController));
router.get('/post/:id', PostController.find.bind(PostController))

router.route('/post')
    .post(validate(PostValidation), PostController.create.bind(PostController))
    .delete(validate(DeletePostValidation),PostController.destroy.bind(PostController))
    .put(validate(updatePostValidation), PostController.update.bind(PostController))
router.put("/post/status",validate(updateStatusValidation),PostController.updateStatus.bind(PostController))
export default router