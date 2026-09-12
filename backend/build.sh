#!/usr/bin/env bash
# exit on error
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_sm || true

python manage.py collectstatic --noinput
python manage.py migrate --noinput
