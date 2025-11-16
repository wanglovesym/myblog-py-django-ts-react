#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

echo "*:*:*:$POSTGRES_USER:$POSTGRES_PASSWORD" > ~/.pgpass
chmod 600 ~/.pgpass

until psql -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

rm ~/.pgpass
>&2 echo "PostgreSQL is up - executing command"
exec $cmd