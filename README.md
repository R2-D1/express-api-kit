# Express.js REST api starter kit with auth based on JWT
## Endpoints:
* [x] Profile
* [x] Login
* [x] Invite user by email
* [x] Reset password
* [x] Forgot password
* [x] Change password
* [x] Change email with activation
* [x] Edit user role
* [x] Delete user
* [ ] Registration

Features:
* [ ] Swagger
* [ ] Prittier
* [ ] Eslint
* [ ] JWT Reset token

## Tech stack:
Express.js, MongoDB, Nginx, Docker, Docker-compose, JWT, Nodemailer.

## Getting Started
### 1. Setup .env file
Create .env file in root directory and copy content from example.env file and change values if needed.
`cp example.env .env`

### 2. Run docker-compose
#### Run Dev
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
#### Stop Dev
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml down` 

#### Run Prod
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
#### Stop Prod
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
  roles: [{ role: 'readWrite', db: '<db_name>' }],
  });`
* new user add to .env file and restart container to apply changes
* Create app user with admin role and` dsf^*jjfhj@9sdfFd` password `db.users.insert({email: "<user_email>", password: "$2a$12$qJyN5hzrD0bCozJjrG6xBeqQObZttKQ5zBexbJkRhKFsb7OuOOc72", role: "admin"})`




