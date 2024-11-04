#!/bin/bash

set -e
set -u

function create_user_and_database() {
	local database=$1
	echo ">>>>>>>>  Creating user and database '$database'"
	{
    psql -q -A -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE USER $database;
        CREATE DATABASE $database WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
        ALTER DATABASE $database OWNER TO $database;
        GRANT ALL ON DATABASE $database TO $database;
EOSQL
  } &> /dev/null
}

function import_sql_files() {
    local database=$1

    search_dir="docker-entrypoint-initdb.d/$database/*.sql"
    for file in $search_dir;
    do
      echo ">>>>>>>>  Import  sql '$file'"
      if [ -f "$file" ]; then
          psql -q -A -d "$database" -U "$database" -f "$file"
      fi
    done
}

echo ">>>>>>>> START SCRIPT INIT <<<<<<<<<<<<<<<"

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo ">>>>>>>> Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo "$POSTGRES_MULTIPLE_DATABASES" | tr ',' ' '); do
		create_user_and_database "$db"
		import_sql_files "$db"
	done

fi

echo ">>>>>>>> END SCRIPT INIT <<<<<<<<<<<<<<<"
