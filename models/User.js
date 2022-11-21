import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const saltRounds = 10;

class UserClass{
    verifyPassword(password){
        return bcrypt.compareSync(password, this.pwd);
    }
}
const userSchema = new Schema({
    nickname: { type: String, required: true },
    pwd: { type: String, required: true, select: false },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    created: { type: Date, default: Date.now() },

},
{
    virtuals: {
        password: {
            set(value){
                this.pwd = bcrypt.hashSync(value, saltRounds);
            }
        }
    }
}
);
userSchema.loadClass(UserClass);

export default model('User', userSchema)