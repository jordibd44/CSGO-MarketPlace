#!/bin/bash

# Inicia ganache y realiza las migraciones
npm run ganache --prefix Blockchain &

sleep 10

cd Blockchain

"node_modules/.bin/truffle" migrate

sleep 10

cd ../

# Inicia el servidor REST API
npm start --prefix Bend/Node+mongoDB &

sleep 10

# Inicia el frontend
npm start --prefix client

# Espera a que todos los procesos en segundo plano terminen
wait
