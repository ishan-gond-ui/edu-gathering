import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: { type: String, default: '' },
    media: { 
        type: String, // This stores the media file URL (image or video)
        required: true, // Ensure media is mandatory
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Validate media presence before saving
postSchema.pre('validate', function(next) {
    if (!this.media) {
        const error = new Error("Media (image or video) is required.");
        next(error);
    } else {
        next();
    }
});

export const Post = mongoose.model('Post', postSchema);
