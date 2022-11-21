import { EnityModel, EnityRequest } from "./enityService.js"
import { RejoinError, RejoinSuccess } from "./rejoinService.js"
import { FIELD_REQUIRED, NOT_FOUND_DOTO_ITEM, BAD_ID } from "./errorService.js"
import TodoItem from '../models/TodoItem.js'

/**
 * @class
 * @augments EnityModel
 */
class TodoEnity extends EnityModel{
    model = TodoItem
    /**
     * @override
     * @returns RejoinError
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
     * @override
     * @returns RejoinError
     */
    async verify_item(){
        if(!super.verify_id())
            return new RejoinError({
                description: BAD_ID[0],
                content: this.id,
                status: BAD_ID[1],
                code: BAD_ID[2]
            }) 
        const item = await super.verify_item()
        if(item) return item
        else return new RejoinError({
            description: NOT_FOUND_DOTO_ITEM[0],
            content: this.id,
            status: NOT_FOUND_DOTO_ITEM[1],
            code: NOT_FOUND_DOTO_ITEM[2]
        }) 
    }
}
/**
 * Добавление дело в список дел
 * @param {*} data - передаваемые данные
 * @returns Rejoin
 */
export const create_todo_item = async function(data){
    console.log(data)
    const todoEnity = new TodoEnity(data)
    
    let result_verify = todoEnity.verify_fields()
    if(result_verify instanceof RejoinError){
        return result_verify
    }

    const todo_item = new TodoItem(todoEnity.data)
    await todo_item.save()

    return new RejoinSuccess({
        description: 'Дело создано.',
        content: todo_item,
        status: 200
    }) 
}
/**
 * Изменения дело в список дел
 * @param {*} data - передаваемые данные
 * @param {*} id - айди дела
 * @returns Rejoin
 */
export const change_todo_item = async function(data, id){
    const todoEnity = new TodoEnity(data, id)
    let result_verify
    
    result_verify = todoEnity.verify_fields()
    if(result_verify instanceof RejoinError){
        return result_verify
    }
    result_verify = await todoEnity.verify_item()
    if(result_verify instanceof RejoinError){
        return result_verify
    }

    const todo_item = result_verify
    console.log(todo_item, 'todo_item')
    todo_item.set(todoEnity.data)
    await todo_item.save()

    return new RejoinSuccess({
        description: 'Дело измененно.',
        content: todo_item,
        status: 200
    }) 
}
/**
 * Удаление дело в список дел
 * @param {*} id - айди дела
 * @returns Rejoin
 */
export const delete_todo_item = async function(id){
    const todoEnity = new TodoEnity(null, id)
    let result_verify

    result_verify = await todoEnity.verify_item()
    if(result_verify instanceof RejoinError){
        return result_verify
    }

    const todo_item = result_verify
    await todo_item.remove()

    return new RejoinSuccess({
        description: 'Дело удаленно.',
        content: todo_item,
        status: 200
    }) 
}
/**
 * @class
 * @augments EnityRequest
 */
class TodoListEnity extends EnityRequest{
    
    limit = null
    skip = null
    /**
     * 
     * @param {number} limit 
     * @param {number} skip 
     */
    constructor(limit, skip){
        super()
        this.limit = limit
        this.skip = skip
    }
    /**
     * Проверка параметров пагинации
     * @returns RejoinError | true
     */
    verify_data_pagination(){
        let missing_fields = []
        if(this.limit && !(this.skip || this.skip == 0)){
            missing_fields.push('skip')
        }else if(!(this.limit || this.limit == 0) && this.skip){
            missing_fields.push('limit')
        }
        if(missing_fields.length){
            return new RejoinError({
                description: FIELD_REQUIRED[0],
                content: missing_fields,
                status: FIELD_REQUIRED[1],
                code: FIELD_REQUIRED[2]
            })
        }else{
            true
        }
    }
}
/**
 * Получение спиcка дел
 * @param {number} limit 
 * @param {number} skip 
 * @returns RejoinError | RejoinSuccess
 */
export const get_todo_list = async function(limit, skip){
    console.log('test')
    const todo_list_enity = new TodoListEnity(limit, skip)

    let result_verify = await todo_list_enity.verify_data_pagination()
    if(result_verify instanceof RejoinError){
        return result_verify
    }
    const list = await TodoItem.find().limit(todo_list_enity.limit).skip(todo_list_enity.skip).exec()
    console.log(list)
    return new RejoinSuccess({
        content: list,
        status: 200
    }) 
}