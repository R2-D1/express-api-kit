# Express.js REST api starter kit with auth based on JWT
This starter kit provides a robust starting point for building RESTful APIs using Express.js, complete with JWT authentication, user management, and more. It's Docker-ready and features an easy setup process.
**Table of Contents**
1. [API Endpoints](#api-endpoints)
2. [Database Structure](#database-structure)
3. [Features](#features)
4. [API Documentation](#api-documentation)
5. [Tech Stack](#tech-stack)
6. [Contribution](#contribution)

## API Endpoints

### User Management

#### Signup
- `POST /users/signup/:token` : Signup is available only by an invite token. Requires a password with certain constraints.

#### Password Management
- `GET /users/check-token/:token` : Check if a reset password token is valid.
- `POST /users/reset-password/:token` : Reset password using a token.
- `POST /users/change-password/` : Change the current user's password. Requires authentication.

#### User Details and Authentication
- `POST /users/change-email` : Change the email of the current user. Requires authentication.
- `POST /users/login` : Login endpoint.
- `POST /users/forgot-password` : Endpoint to initiate a password reset.

#### User Role
- `PUT /users/change-role/:id` : Change the role of a user by its ID. Requires admin permissions.

#### User Retrieval and Deletion
- `GET /users/` : Retrieve all users. Requires admin permissions.
- `DELETE /users/:id` : Delete a user by its ID. Requires admin permissions.

### Invites

#### Invite Management
- `POST /invites/` : Invite a user by email. Requires admin permissions.
- `GET /invites/check-token/:token` : Check if an invite token is valid.
- `GET /invites/` : Retrieve all invites. Requires admin permissions.
- `DELETE /invites/:id` : Delete an invite by its ID. Requires admin permissions.

## Database Structure

### Invite Model

| Field | Type     | Required | Description       |
|-------|----------|----------|-------------------|
| _id   | ObjectId | Yes      | Unique identifier |
| email | String   | Yes      | Email of the user |
| token | String   | Yes      | Unique token      |

### User Model

| Field                | Type     | Required | Description                       |
|----------------------|----------|----------|-----------------------------------|
| _id                  | ObjectId | Yes      | Unique identifier                 |
| email                | String   | Yes      | Email of the user                 |
| password             | String   | Yes      | Hashed password of the user       |
| role                 | String   | Yes      | Role of the user (e.g., admin)    |
| reset_password_token | String   | No       | Token used for resetting password |

# Features:
* [x] Swagger
* [ ] Prettier
* [ ] Eslint
* [ ] JWT Reset token

## API Documentation

Our API endpoints are well-documented and described with Swagger. To view the API documentation, navigate to /api-docs. For example:
[Local API Documentation](http://localhost:3000/api-docs)

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

## Contribution

We welcome contributions from everyone! If you find a bug or want to propose a new feature:

1. Check if the issue already exists.
2. If not, create a new one.
3. Fork the repo, make your changes, and submit a pull request. Ensure your changes are well-documented.