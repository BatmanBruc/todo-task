import jwt from 'jsonwebtoken'
import { EnityModel, EnityRequest } from "./enityService.js"
import { FIELD_REQUIRED, USER_ALREADY_EXISTS, NOT_FOUND_NICKENAME, BAD_PASSWORD, BAD_TOKEN } from "./errorService.js"
import { RejoinError, RejoinSuccess } from "./rejoinService.js"
import User from "../models/User.js"

const jwt_token = 'ya-s0-s1-b1-b2'
/**
 * @class
 * @augments EnityModel
 */
class UserEnity extends EnityModel{
    model = User
    /**
     * @override
     * @returns RejoinError | true
     */
    verify_fields(){
        let missing_fields = super.verify_fields()
        if(missing_fields.length){
            return new RejoinError({
                description: FIELD_REQUIRED[0],
                content: missing_fields,
                status: FIELD_REQUIRED[1],
                code: FIELD_REQUIRED[2]
            })
        }
        return true
    }
    /**
     * Проверка на уже сущестующего пользователя с передаваемым никнеймом
     * @returns RejoinError | true
     */
    async verify_is_user(){
        let user = await this.model.exists({nickname: this.data.nickname})
        if(user){
            return new RejoinError({
                description: USER_ALREADY_EXISTS[0],
                content: this.data.nickname,
                status: USER_ALREADY_EXISTS[1],
                code: USER_ALREADY_EXISTS[2]
            })
        }
        return true
    }
}
/**
 * Создание пользователя
 * @param {object} data 
 * @returns RejoinSuccess | RejoinError
 */
export const create_user = async function(data){
    const user_enity = new UserEnity(data)
    let result_verify

    result_verify = user_enity.verify_fields()
    if(result_verify instanceof RejoinError){
        return result_verify
    }
    result_verify = await user_enity.verify_is_user()
    if(result_verify instanceof RejoinError){
        return result_verify
    }

    const user = new User(user_enity.data)
    await user.save()
    return new RejoinSuccess({
        description: 'Регистрация прошла успешна.',
        content: user,
        status: 200
    })
}

/**
 * @class
 * @augments EnityRequest
 */
class SignInEnity extends EnityRequest{
    params = {
        nickname: true,
        password: true
    }
    /**
     * Проверка логина и пароля
     * @returns RejoinError | true
     */
    async verify_sign_in(){
        const user = await User.findOne({nickname: this.data.nickname}).select('+pwd').exec()
        if(!user){
            return new RejoinError({
                description: NOT_FOUND_NICKENAME[0],
                content: this.data.nickname,
                status: NOT_FOUND_NICKENAME[1],
                code: NOT_FOUND_NICKENAME[2]
            })
        }
        let result = user.verifyPassword(this.data.password)
        if(!result){
            return new RejoinError({
                description: BAD_PASSWORD[0],
                status: BAD_PASSWORD[1],
                code: BAD_PASSWORD[2]
            })
        }
        return user
    }

    /**
     * @override
     * @returns RejoinError | true
     */
    verify_fields(){
        let missing_fields = super.verify_fields()
        if(missing_fields.length){
            return new RejoinError({
                description: FIELD_REQUIRED[0],
                content: missing_fields,
                status: FIELD_REQUIRED[1],
                code: FIELD_REQUIRED[2]
            })
        }
        return true
    }
}

/**
 * Авторизация пользователя и возрат токена
 * @param {*} data 
 * @returns RejoinError | RejoinSuccess
 */
export const sign_in = async function(data){
    const user_enity = new SignInEnity(data)
    let result_verify

    result_verify = user_enity.verify_fields()
    if(result_verify instanceof RejoinError){
        return result_verify
    }
    result_verify = await user_enity.verify_sign_in()
    if(result_verify instanceof RejoinError){
        return result_verify
    }

    const userInfo = {
        id: result_verify.id,
        nickname: result_verify.nickname
    }
    return new RejoinSuccess({
        description: 'Успешно.',
        content: {
            user: userInfo,
            jwt: jwt.sign(userInfo, jwt_token)
        },
        status: 200
    })
}

export const user_middleware = function(req, res, next){
    const resError =  new RejoinError({
        description: BAD_TOKEN[0],
        status: BAD_TOKEN[1],
        code: BAD_TOKEN[2]
    })
    if (req.cookies['auth_token']) {
        jwt.verify(
            req.cookies['auth_token'],
            jwt_token,
            async (err, payload) => {
                console.log(err)
                if (err){
                    console.log(err)
                    res.status(resError.get_status())
                    res.send(resError.get())
                }
                else if (payload) {
                    let user = await User.findById(payload.id).exec()
                    if(!user){
                        res.status(resError.get_status())
                        res.send(resError.get())
                    }else{
                        next()
                    }
                }
            }
        )
        return
    }else{
        res.status(resError.get_status())
        res.send(resError.get())
        return
    }
}