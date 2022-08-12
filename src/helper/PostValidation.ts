import {validate, ValidationError, Joi} from 'express-validation'
const PostValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        userId: Joi.string().required(),
        status: Joi.number().required()
    })
}

export const DeletePostValidation = {
    body: Joi.object({
        id: Joi.string().required()
    })
}
export const updatePostValidation = {
    body: Joi.object({
        text: Joi.string().required(),
        status: Joi.number().required(),
        id: Joi.string().required()
    })
}

export const updateStatusValidation = {
    body: Joi.object({
        id: Joi.string().required(),
        status: Joi.number().required()
    })
}
export default PostValidation