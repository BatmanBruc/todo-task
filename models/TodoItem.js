import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    created: { type: Date, default: Date.now() }
});

export default model('TodoItem', userSchema)