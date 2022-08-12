import * as mongoose from 'mongoose';
const { Schema } = mongoose

const MediaSchema = new Schema({
    type: {type: String},
    url: {type: String}
})
const PostSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status:{
        type: Number,
        required: true
    },
    media: [
        MediaSchema
    ]
},{
    timestamps: true
})


export default mongoose.model('Post', PostSchema);