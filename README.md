<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


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
```
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
  