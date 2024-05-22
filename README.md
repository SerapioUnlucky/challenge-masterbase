# Introduction

API Documentation for the MasterBase challenge.

# Installation

To install and run the API, follow these steps:

- git clone https://github.com/tu-repositorio/tu-proyecto.git
- cd challenge-masterbase
- npm install o yarn install
- npm run dev o yarn dev

# Rutas de la API

## GET / Users

Description: Request to retrieve all users from the database.

URL: http://{server}/api/v1/users/view/all

Method: GET

## GET / User

Description: Request to retrieve a specific user by the entered ID.

URL: http://{server}/api/v1/users/view/:id

Method: GET

URL Parameters:

- id: It is an ObjectId and it is mandatory to provide it.

## POST / Login

Description: Request to log in as a user and perform requests that require authorization.

URL: http://{server}/api/v1/users/login

Method: POST

Body Parameters:
```json
{
    "email": "jose.marin@masterbase.com",
    "password": "soyunapassword"
}
```

## POST / Register

Description: Request to register a new user in the database, validating the entered parameters.

URL: http://{server}/api/v1/users/register

Method: POST

Body Parameters:
```json
{
    "email": "jose.marin@masterbase.com",
    "password": "soyunapassword",
    "role": "admin",
    "name": "José Miguel",
    "lastname": "Marín"
}
```

## DELETE / User

Description: Request to delete a user from the database based on the ID entered in the URL.

URL: http://{server}/api/v1/users/delete/:id

Method: DELETE

URL Parameters:

- id: It is an ObjectId and it is mandatory to provide it.

## UPDATE / User

Description: Request to update or edit a user information based on the ID entered in the URL.

URL: http://{server}/api/v1/users/update/:id

URL Parameters:

- id: It is an ObjectId and it is mandatory to provide it.

Body Parameters:
```json
{
    "email": "jose.marin@masterbase.com",
    "password": "soyunapassword",
    "role": "admin",
    "name": "José Miguel",
    "lastname": "Marín"
}
```

# Authorization

The API uses the "Authorization" header in requests to secure the routes, where the authorization token should be included.

# Conclusion

End of the documentation.
