# DomainModelExtractorUI




## Env Setup
### Front-end

```
cd dme-react
```

- install dependencies `npm i`
- runs the app in the development mode `npm start`

### Back-end

```
cd dme_flask
```

I am using [Pipenv](https://github.com/pypa/pipenv) for Python package management. 

- install dependencies `pipenv install --dev`
- runs the app in the development mode `./run`  (for *nix/macOS)

### MongoDB

- Install MongoDB: [Install MongoDB Community Edition — MongoDB Manual](https://docs.mongodb.com/manual/administration/install-community/)

- `// TODO`

## APIs

- Login: 

    - endpoint: `/users/login`  

    - method: **POST ** `Content-Type: application/json`

    - body:

        - ```json
            {
              "email": "happy@usc.edu",
              "password": "happy"
            }
            ```

- Sign up: 

    - endpoint: `/users/register`

    - method: **POST**  `Content-Type: application/json`

    - body: 

        - ```json
            {
                "first_name": "Joe",
                "last_name": "Biden",
                "email": "Joe@whitehouse.gov",
                "password": "icecream"
            }
            ```

            

    

    

