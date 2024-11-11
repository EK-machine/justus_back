INSERT INTO public.rules
  (method, def)
VALUES
  ('users.get', 'получить список всех пользователей'), --1
  ('users.getById', 'получить пользователя по id'), --2
  ('users.create', 'создать пользователя'), --3
  ('users.update', 'обновить пользователя'), --4
  ('users.delete', 'удалить пользователя'), --5
  ('rbac.get_roles', 'получить список всех ролей'), --6
  ('rbac.get_role_by_id', 'получить роль по id'), --7
  ('rbac.create_role', 'создать роль'), --8
  ('rbac.update_role', 'обновить роль'), --9
  ('rbac.delete_role', 'удалить роль'), --10
  ('rbac.add_rules_to_role', 'добавить правила к роли'), --11
  ('rbac.del_rules_from_role', 'удалить правила из роли'), --12
  ('rbac.add_role_to_user', 'добавить роль пользователю'), --13
  ('roles.del_role_from_user', 'удалить роль у пользователя'), --14
  ('rbac.get_rules', 'получить список всех правил'); --15




