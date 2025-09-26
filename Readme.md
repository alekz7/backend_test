# Título del Proyecto

Api rest consumiendo una base de datos y haciendo unit testing de 2 endpoints

### Pre-requisitos 📋

Tener instalado node version v12.16.1

> node --version
> v12.16.1

### Instalación 🔧

colocarse en el directorio raiz y ejecutar npm i

> npm i

## Database (DB) module

This project uses a small singleton DB connection module located at `src/database/database.js`.
Load environment variables before requiring modules that access the DB. The recommended place to call dotenv is at the very top of your entrypoint (`src/app.js`) like:

```javascript
require("dotenv").config();
const app = require("./src/app");
```

The DB module reads the connection string from `process.env.MONGODB_URI` at connect time. It exposes a small, clear API:

- `await db.connect()` — connects to MongoDB (supports retries, returns when connected)
- `db.get()` — legacy getter returning the `MongoClient` instance (kept for compatibility)
- `db.getClient()` — explicit `MongoClient` accessor
- `db.getDb(dbName?)` — returns a `Db` instance (defaults to `process.env.MONGODB_DBNAME` or `test`)
- `await db.close()` — closes the connection

Example usage in `src/app.js` (already wired in this project):

```javascript
require("dotenv").config();
const db = require("./database/database");

async function start() {
  await db.connect();
  const usersColl = db.getDb().collection("users");
  // ... start server
}

start();
```

Tips for tests

- Load dotenv in test setup (or in `src/app.js`) so `MONGODB_URI` is available to the DB module.
- Consider using an in-memory MongoDB (mongodb-memory-server) for CI to avoid hitting a real database.

## Ejecutando las pruebas ⚙️

para ejecutar las pruebas automaticas ejecutar el comando npm run test

> npm run test

### Analice las pruebas end-to-end 🔩

si todo sale bien deberas observar el siguiente resultado

> mocha src/test/\*.test.js --exit

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

- **Fazt Code** - _Trabajo Inicial_ - (https://www.youtube.com/watch?v=uIdbfW2T8NE&t=13s)
- **Alejandro Aragon** - _Documentación, complemento MongoDB_ - [http://alejandroaragon.herokuapp.com/]
