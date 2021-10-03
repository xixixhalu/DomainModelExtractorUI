# DomainModelExtractorUI




## Env Setup
### Front-end

Node version: LTS/fermium ( v14.16.0)

```
cd dme-react
```

- install dependencies `npm i`
- runs the app in the development mode `npm start`

- https://create-react-app.dev/docs/deployment/)

### Back-end

```
cd dme_flask
```

I am using [Pipenv](https://github.com/pypa/pipenv) for Python package management.  

- install dependencies `pipenv install --dev`
- activate virtual environment ` pipenv shell `
- runs the app in the development mode `./run`  (for *nix/macOS)

### MongoDB

- Install MongoDB: [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition), [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/), [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

- Run MongoDB: [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition), [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition-as-a-windows-service)



## Front-end: Deploy

- [Creating a Production Build | Create React App (create-react-app.dev)](https://create-react-app.dev/docs/production-build)
- [Deployment | Create React App (create-react-app.dev)](https://create-react-app.dev/docs/deployment/)

## APIs

- Login: 

    - endpoint: `/users/login`  

    - method: **POST** `Content-Type: application/json`

    - request body: 

        - ```json
            {
              "email": "happy@usc.edu",
              "password": "happy"
            }
            ```

- Sign up: 

    - endpoint: `/users/register`

    - method: **POST**  `Content-Type: application/json`

    - request body: 

        - ```json
            {
                "first_name": "Joe",
                "last_name": "Biden",
                "email": "Joe@whitehouse.gov",
                "password": "icecream"
            }
            ```

- Check win conditions: 

    - endpoint: `/detect`

    - method: **POST**  `Content-Type: application/json`

    - request body: 

        - ```json
            {
                "userInput": "win condtiions",
            }
            ```
        
    - response body:
    
        - ```json
            {"option": "Change Line 27: Word: webcraweler Change to: webcrawler"}
            ```
    
- Generate domain model: 

    - endpoint: `/model`

    - method: **POST**  `Content-Type: application/json`

    - request body: 

        - ```json
            {
                "userInput": "win condtiions",
            }
            ```
            
    
    - response body:
    
        - ```json
            {
                "img": "https://upload.wikimedia.org/wikipedia/commons/8/84/Apple_Campus_One_Infinite_Loop_Sign.jpg"
            }
            ```
    
            
    
    
    
    
    
    
    
    

