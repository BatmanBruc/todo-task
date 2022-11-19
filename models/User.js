import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    created: { type: Date, default: Date.now() },

});


export default User = model('User', userSchema)