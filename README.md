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
# Una vez creado el Docker-compose ejecutamos el siguiente comando

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