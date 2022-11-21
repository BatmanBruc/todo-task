import { create_user, sign_in } from "../services/userService.js"

export const auth_register = async function(req, res){
    const rejoin = await create_user(req.body)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const auth_login = async function(req, res){
    const rejoin = await sign_in(req.body)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}