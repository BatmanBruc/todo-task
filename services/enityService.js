import { Types } from "mongoose"
/**
 * @class
 * Класс для организации и проверки изменения модели
 */
export class EnityModel{
    /**
     * 
     * @param {object} data - данные передаваемые в запрос
     * @param {string} id - id документа 
     * @property {string} model - модель
     */
    data = null
    id = null
    model = null
    constructor(data, id){
        this.data = data
        this.id = id
    }
    verify_id(){
        if(!this.id || !Types.ObjectId.isValid(this.id))
            return false
        else
            return true
    }
    /**
     * Проверяет наличие всех обязательных полей, основываясь на схеме модели, и возращает пропущенные 
     * @returns {(Array | Array<string>)} missing_fields
     */
    verify_fields(){
        let missing_fields = []
        const schema = this.model.schema.paths
        for( let prop in schema){
            if(schema[prop].isRequired && schema[prop].selected !== false){
                    if(!this.data[prop] && typeof this.data[prop] != 'boolean')
                        missing_fields.push(prop)
            }
        }
        return missing_fields
    }
    /**
     * Возращает документ, либо null
     * @returns {Promise<Document | null>}
     */
    async verify_item(){
        return await this.model.findById(this.id).exec()
    }
}
/**
 * Класс для организации и проверки запроса
 */
export class EnityRequest{
    /**
     * 
     * @param {object} data - данные передаваемые в запрос
     * @param {{ string: boolean }} params - переменная указывающая какие поля обязательны для запроса
     */
    constructor(data, params){
        this.data = data
        this.params = params
    }
    /**
     * Проверяет наличие всех обязательных полей, основываясь на переменной @var params, и возращает пропущенные 
     * @returns {(Array | Array<string>)} missing_fields
     */
    verify_fields(){
        let missing_fields = []
        for( let prop in this.params){
            if(this.params[prop]){
                    if(!this.data[prop] && typeof this.data[prop] != 'boolean')
                        missing_fields.push(prop)
            }
        }
        return missing_fields
    }
}