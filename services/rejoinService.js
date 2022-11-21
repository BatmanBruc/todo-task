/**
 * @class
 * Класс представляющий ответ запроса
 */
export class Rejoin{
    /**
     * @property {string} description
     * @property {any} content
     * @property {number} status
     * @param {
     *  {
     *      description: string,
     *      content: any,
     *      status: number,
     *  }
     * } data 
     */
    constructor(data){
        this.description = data.description
        this.content = data.content
        this.status = data.status
    }
    get_status(){
        return this.status;
    }
    get(){
        return {
            description: this.description,
            content: this.content
        }
    }
}
/**
 * @class
 * @augments Rejoin
 * Класс представляющий ответ запроса с ошибкой
 */
export class RejoinError extends Rejoin{
    /**
     * @property {number} code - код ошибки
     * @param {
     *  {
     *      description: string,
     *      content: any,
     *      status: number,
     *      code: number
     *  }
     * } data 
     */
    constructor(data){
        super(data)
        this.code = data.code
    }
    get(){
        return {
            ...super.get(),
            code: this.code 
        }
    }
}
/**
 * @class
 * @augments Rejoin
 * Класс представляющий ответ запроса с ошибкой
 */
export class RejoinSuccess extends Rejoin{
}