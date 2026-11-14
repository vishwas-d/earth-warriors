#!/bin/sh
set -eu

python manage.py migrate --noinput
if [ "${SEED_DEMO_DATA:-1}" = "1" ]; then
    python manage.py seed_demo
fi
python manage.py collectstatic --noinput
mkdir -p /app/staticfiles /app/media
chown -R appuser:appuser /app/staticfiles /app/media

exec gosu appuser "$@"
