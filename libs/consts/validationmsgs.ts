export const VALIDATION_MSGS = {
    ID_IS_EMPTY: 'Идентификатор не указан',
    NAME_IS_STRING: 'имя должно быть строкой',
    NAME_IS_EMPTY: 'имя не указано',
    EMAIL_IS_NOT_CORRECT: 'мейл имеет неверный формат',
    EMAIL_IS_EMPTY: 'мейл не указан',
    PASS_IS_STRING: 'Пароль должен быть строкой',
    PASS_IS_EMPTY: 'Пароль не указан',
    WITH_RULES_IS_BOOL: '"Правила" должны быть значением верно/ложно',
    ROLE_IS_STRING: 'Роль должна быть строкой',
    ROLE_IS_EMPTY: 'Роль не указана',
    ROLE_RULES_IS_ARRAY: 'Id правил должны быть массивом',
    ROLE_RULES_IS_NUM: 'Id правил не являются номерами',
    ROLE_RULES_IS_POS_NUM: 'Id должны быть положительным числом',
    USER_ID_IS_NUM: 'Id пользователя должен быть числом',
    USER_ID_IS_POS_NUM: 'Id пользователя должен быть положительным числом',
    USER_ID_IS_EMPTY: 'Id пользователя не указан',
};

export const userExists = (email: string) => `пользователь с email ${email} уже существует`;
export const userDoesNotExists = (email: string) => `пользователя с email ${email} не существует`;

export const ERRORR_MSGS = {
  MAIN_USER_DEL: 'нельзя удалить главного пользователя',
  MAIN_USER_UPDATE: 'нельзя обновить главного пользователя',
  USERS_NOT_FOUD: 'пользователи не найдены',
  USERS_INCORRECT_CREDS: 'не верные пароль или логин',
  NO_USER_MAIL_RT: 'не существует токена связанного с email',
  NO_RT: 'токен не передан',
  RT_NOT_VERIFIED: 'токен не верно верифицирован',
  RT_NO_MATCH: 'переданный токен не совпадает с текущим'
}