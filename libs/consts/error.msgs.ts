export const userExists = (email: string) => `пользователь с email ${email} уже существует`;
export const userDoesNotExists = (email: string) => `пользователя с email ${email} не существует`;

export const ERRORR_MSGS = {
  ONLY_MAIN_USER: 'только главный пользователь имеет право на данное действие',
  SAME_USER: 'пользователь не может применять данное дейсвие к самому себе',
  MAIN_USER_DEL: 'нельзя удалить главного пользователя',
  MAIN_USER_UPDATE: 'нельзя обновить главного пользователя',
  USERS_NOT_FOUD: 'пользователи не найдены',
  USERS_INCORRECT_CREDS: 'не верные пароль или логин',
  NO_USER_MAIL_RT: 'не существует токена связанного с email',
  NO_RT: 'токен не передан',
  RT_NOT_VERIFIED: 'токен не верно верифицирован',
  RT_NO_MATCH: 'переданный токен не совпадает с текущим'
}