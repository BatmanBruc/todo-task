export const FIELD_REQUIRED = ['Не заполнены необходимые поле:', 400, 0]
export const NOT_FOUND_ITEM = ['ПОзиция не найдена:', 400, 1]
export const BAD_ID = ['Некорректный id:', 400, 2]

export const USER_ALREADY_EXISTS = ['Пользователь с таким никнеймом уже существует:', 400, 'auth_0']
export const NOT_FOUND_NICKENAME = ['Не найден никнейм', 400, 'auth_1']
export const BAD_PASSWORD = ['Неправильный пароль', 400, 'auth_2']
export const BAD_TOKEN = ['Неверый токен', 400, 'auth_3']

export const NOT_FOUND_DOTO_ITEM = ['Дело не найдено', NOT_FOUND_ITEM[1], 'todo_' + NOT_FOUND_ITEM[2]]