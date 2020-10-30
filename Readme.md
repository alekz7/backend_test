# Título del Proyecto

Api rest consumiendo una base de datos y haciendo unit testing de 2 endpoints

### Pre-requisitos 📋

Tener instalado node version v12.16.1

> node --version
v12.16.1

### Instalación 🔧

colocarse en el directorio raiz y ejecutar npm i

>npm i

## Ejecutando las pruebas ⚙️

para ejecutar las pruebas automaticas ejecutar el comando npm run test

>npm run test

### Analice las pruebas end-to-end 🔩

si todo sale bien deberas observar el siguiente resultado

> mocha src/test/*.test.js --exit



  testing initial route hello world
    √ respond with hello world

  este test nos va a ayudar a probar el POST /POST/users
servidor en puerto 3000
    √ respond with json containing a single user (98ms)
    √ respond with json "user found" when the user exist (89ms)
    √ respond with json "user not found" when the user doesnt exist (87ms)
    √ respond with 201 when created (114ms)
    √ respond with 400 on bad request


  6 passing (1s)

## Autores ✒️

* **Fazt Code** - *Trabajo Inicial* - (https://www.youtube.com/watch?v=uIdbfW2T8NE&t=13s)
* **Alejandro Aragon** - *Documentación, complemento MongoDB* - [http://alejandroaragon.herokuapp.com/]
