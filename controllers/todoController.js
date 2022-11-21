import { create_todo_item, change_todo_item, delete_todo_item, get_todo_list } from "../services/todoService.js"

export const todo_create = async function(req, res){
    const rejoin = await create_todo_item(req.body)
    console.log(rejoin)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
export const todo_change = async function(req, res){
    const rejoin = await change_todo_item(req.body, req.params.id)
    console.log(rejoin)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
export const todo_delete = async function(req, res){
    const rejoin = await delete_todo_item(req.body, req.params.id)
    console.log(rejoin)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
export const todo_get_list = async function(req, res){
    const rejoin = await get_todo_list(req.body.limit, req.body.skip)
    console.log(rejoin)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
