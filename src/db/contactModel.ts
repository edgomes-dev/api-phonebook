import mongoose, { Schema } from "mongoose"

const ContactSchema = new Schema(
{
    name:
    {
        type: String,
        required: true
    },
    telephone:
    {
        type: Number,
        required: true,
        minlength: 6
    },
    email:
    {
        type: String,
    },
    group:
    {
        type: String,
        required: true
    },
    isFavorite:
    {
        type: Boolean
    },
    isDelete:
    {
        type:  Boolean
    },
    company:
    {
        type: String
    },
    office:
    {
        type: String
    },
    description:
    {
        type: String
    },
    created_at:
    {
        type: Date,
        required: true,
        default: Date.now()
    },
    updated_at:
    {
        type: Date,
        required: true,
        default: Date.now()
    },
    deleted_at:
    {
        type: Date,
        default: null
    }
});

export const ContactModel = mongoose.model('Contact', ContactSchema);
