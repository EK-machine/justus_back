CREATE TABLE public.users (
  "id" SERIAL NOT NULL CONSTRAINT "PK_1_1" PRIMARY KEY,
  "name" CHARACTER VARYING NOT NULL,
  "email" CHARACTER VARYING UNIQUE NOT NULL,
  "password" CHARACTER VARYING NOT NULL
);

CREATE TABLE public.users_roles (
  "id" SERIAL NOT NULL CONSTRAINT "PK_1_2" PRIMARY KEY,
  "role_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL CONSTRAINT "fk_1_1" REFERENCES public.users
);

CREATE TABLE public.users_rt (
  "id" SERIAL NOT NULL CONSTRAINT "PK_1_3" PRIMARY KEY,
  "email" CHARACTER VARYING UNIQUE,
  "rt" CHARACTER VARYING UNIQUE
);