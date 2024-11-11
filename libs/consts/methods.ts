export enum Methods {
  // users
  USERS_GET = 'users.get',
  USERS_GET_BY_ID = 'users.getById',
  USERS_CREATE = 'users.create',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',
  // rbac
  RBAC_GET_ROLES = 'rbac.get_roles', // roles
  RBAC_GET_ROLE_BY_ID = 'rbac.get_role_by_id', // roles/:id
  RBAC_CREATE_ROLE = 'rbac.create_role', // roles/create
  RBAC_UPDATE_ROLE = 'rbac.update_role', // roles/update/:id
  RBAC_DELETE_ROLE = 'rbac.delete_role', // roles/delete/:id
  RBAC_ADD_RULES_TO_ROLE = 'rbac.add_rules_to_role', // roles/add-rules/:id
  RBAC_DEL_RULES_FROM_ROLE = 'rbac.del_rules_from_role', // roles/del-rules/:id
  RBAC_ADD_ROLE_TO_USER = 'rbac.add_role_to_user', // roles/add-roles/:id
  RBAC_DEL_ROLE_FROM_USER = 'roles.del_role_from_user', // roles/del-roles/:id
  RBAC_GET_RULES = 'rbac.get_rules', // rules
}