FROM python:3.8-alpine

ADD . /app
WORKDIR /app

EXPOSE 8000