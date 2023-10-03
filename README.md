<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Installation

```bash
$ npm install
```

## Correcr aplicacion

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configuracion de Docker-compose
```bash
# Una vez creado el Docker-compose ejecutamos el siguiente comando, si ocupamos el -d es para que no este enlazada a la terminal usada

docker-compose up -d
 O
docker-compose up
```



## Creamos una connecion a TablePlus despues de crear la imagen
  En este apartado es importante respertar la __"PASSWORD"__
  utilizada en el .env, el usuario lo definimos como __"postgres"__
  y realizamos la conexion, de moento no se verqa nada ya que 
  la base de datos aun esta vacia.

## Configurar variables de entorno

```bash
# como primer paso vamos a instalar el modulo que nos permite crearlas
npm i @nestjs/config
```
Luego agregaremos en app.module.ts el siguiente codigo
```bash
ConfigModule.forRoot()
```
y lo siguiente
```bash
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,//carga automaticamente las entidades
      synchronize: true, //cambio en entidades se sincroniza, si vamos a produccion esto se deja como FALSO/false
    }),
```
## Agregamos typeORM

```bash
# en la linea de comando agregamos el siguiente codigo
npm install --save @nestjs/typeorm typeorm
# para trabajar con typeORM agregar esto
npm i pg 
```

## Agregamos la validacion de clases

```bash
$ npm i class-validator class-transformer
```

## Agregamos UUID

```bash
$ npm i --save-dev @types/uuid
```

## Agregamos los tipos de UUID

```bash
$ npm i -D @types/uuid
```


## Postman

```bash

# Ejecutar SEED
localhost:3000/api/seed

# Get
localhost:3000/api/products?limit=2&offset=1

# Get
localhost:3000/api/products

# Get
localhost:3000/api/products/0d0ebdf3-8efa-4313-8446-fb79d670e85c

# Post
localhost:3000/api/products
{
    "title": "Camisa",
    "size": ["SM","M","L"],
    "gender": "men",
    "price": 300.99,
    "images": [
        "http://imagen7.jpg",
        "http://imagen8.jpg",
        "http://imagen9.jpg"
    ]
}

# Patch
localhost:3000/api/products/9a9329dc-712f-479f-8e1c-638409e19c93
{
    "price": 100,
    "images": [
        "https://imageeeeeen.jgp"
    ]
}

# Delete
localhost:3000/api/products/069a4a3f-3f58-4949-984d-5a44f6e215ba

```