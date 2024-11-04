CREATE TABLE public.users (
  "id" SERIAL NOT NULL CONSTRAINT "PK_1_1" PRIMARY KEY,
  "name" CHARACTER VARYING NOT NULL,
  "user_name" CHARACTER VARYING NOT NULL,
  "email" CHARACTER VARYING NOT NULL,
  "password" CHARACTER VARYING NOT NULL,
  CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("user_name"),
  CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
);

CREATE TABLE public.users_roles (
  id SERIAL NOT NULL CONSTRAINT "PK_1_2" PRIMARY KEY,
  role_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL CONSTRAINT fk_1_1 REFERENCES public.users
);