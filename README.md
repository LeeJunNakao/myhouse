# INSTRUCTIONS

## Generate a new migration:
* Open typeorm directory and run the command: `yarn typeorm migration:generate -n <migration name>` or `npm run typeorm migration:generate -n <migration name>`

## Run migrations:
* Still inside typeorm directory, run the command if dev: `yarn run migrate:dev` or `npm run migrate:dev`
* Still inside typeorm directory, run the command if production: `yarn typeorm migration:run` or `npm run typeorm migration:run`

## Attention - TYPEORM:
* Remember install typeorm modules typing the command inside its directory: `yarn` or `npm install`
* Environment variables needed. Create a .env directory with necessary variables. A .env model is present inside .envExample.

## Docker 
### Run server
* `docker-compose run --service-ports myhouse-app`

### RUN TESTS
* `docker-compose run test`

### USING GIT
* Copy your ssh files into ~/shared_ssh, the docker will import them

## Endpoints

* Those endpoints are protected and a token is needed. To get a token use the logger service to authenticate: https://github.com/LeeJunNakao/logger 

### House /house  

#### POST
**request payload:**  
```json
{  
    "name": "string",  
    "members": "number[]",  
}  
```
**headers**  
```json
{  
    "token": "string",  
}  
```

#### GET
**headers**  
```json
{  
    "token": "string",  
}  
```

#### PUT /house/:house-id  
**request payload:**
```json
{  
    "name": "string",  
    "members": "number[]",  
}  
```
**headers**  
```json
{  
    "token": "string",  
}  
```

#### DELETE /house/:house-id  
**headers**  
```json
{  
    "token": "string",  
}  
```

### Purchase /house/:house-id/purchase  

#### POST
**request payload:**  
```json
{  
    "date": "timestamp",  
    "description": "string",  
    "value": "integer",  
}  
```
**headers**  
```json
{  
    "token": "string",  
}  
```

#### GET
**headers**  
```json
{  
    "token": "string",  
}  
```

#### PUT /house/:house-id/purchase/:purchase-id  
**request payload:**
```json
{  
    "date": "timestamp",  
    "description": "string",  
    "value": "integer",  
}  
```
**headers**  
```json
{  
    "token": "string",  
}  
```

#### DELETE /house/:house-id/purchase/:purchase-id  
**headers**  
```json
{  
    "token": "string",  
}  
```