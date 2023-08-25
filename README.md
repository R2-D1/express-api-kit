## 1. Setup .env file
Create .env file in root directory and copy content from example.env file and change values if needed. 


## 2. Run docker-compose
## Dev
#### Run
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
#### Stop
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml down` 

## Prod
#### Run
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
#### Stop
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml down` 

## 3. Setup database
By default, database will create with user from .env file, but you have to create user exact for your db
#### Connect to db container
* show all containers `docker ps`
* connect to the mongo container `docker exec -it <container_id> bash`
* connect to the mongo inside container `mongosh -u <username>`
* use some db (by default express-api-kit)  `use <db_name>`
* create user with read and write permissions `db.createUser({
  pwd: 'testpass',
  user: 'testuser',
  roles: [{ role: 'readWrite', db: 'express-app-kit' }],
  });`
* new user add to .env file and restart container to apply changes



