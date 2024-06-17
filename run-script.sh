#!/bin/sh

python models-server/server.py &
npm run start:dev
