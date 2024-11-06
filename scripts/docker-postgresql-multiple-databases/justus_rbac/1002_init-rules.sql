INSERT INTO public.rules
  (method, def)
VALUES
  ('users.get', 'получить список всех пользователей'), --1
  ('users.getById', 'получить пользователя по id'), --2
  ('users.create', 'создать пользователя'), --3
  ('users.udate', 'обновить пользователя'), --4
  ('users.delete', 'удалить пользователя'); --5



