from flask import Flask, json, jsonify, request, Response
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

import base64
#from dme_ui_api.api_functions import *

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'dmelogindb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/dmelogindb'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['MONGO_DBNAME'] = 'dmedb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/dmedb'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo_dme = PyMongo(app)

CORS(app)


@app.route('/users/register', methods=["POST"])
def register():
    users = mongo.db.users
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(
        request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    exist_user = users.find_one({'email': email})

    if exist_user:
        result = Response(
            '{"error": "Denied: Email already exits."}',
            status=409,
            mimetype='application/json'
        )
        return result

    user_id = users.insert({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'created': created
    })

    new_user = users.find_one({'_id': user_id})

    result = {'email': new_user['email'] + ' registered'}

    return jsonify({'result': result})


@app.route('/users/login', methods=['POST'])
def login():
    users = mongo.db.users
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity={
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email']
            })
            result = jsonify({'token': access_token})
        else:
            result = Response(
                '{"error": "Unauthorized: Invalid username and password."}',
                status=401,
                mimetype='application/json'
            )
    else:
        result = Response(
            '{"error": "Unauthorized: No results found"}',
            status=401,
            mimetype='application/json'
        )
    return result


@app.route('/detect', methods=['POST'])
def search_for_misspell():
    json_data = json.loads(str(request.data, encoding='utf-8'))
    input_str_list = json_data["userInput"].split("\n")
    result_msg = api_misspelling(input_str_list)

    result = {"option": result_msg}
    return jsonify(result)


@app.route('/model', methods=['POST'])
def get_result_img():
    json_data = json.loads(str(request.data, encoding='utf-8'))
    input_str_list = json_data["userInput"].split("\n")
    output = api_diagram_generator(input_str_list)

    return jsonify({"format": output[1], "content": output[0], "msg": output[2]})


@app.route('/project', methods=["POST"])
def create_project():
    projects = mongo_dme.db.projects
    project_name = request.get_json()['project_name']
    created = datetime.utcnow()

    project_id = projects.insert({
        'project_name': project_name,
        'created': created
    })

    new_project = projects.find_one({'_id': project_id})

    return jsonify({'status_message': new_project['project_name'] + ' was created successfully.'})


@app.route('/project/<project_id>', methods=["GET"])
def get_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        project={
            'project_id': project_id,
            'project_name': response['project_name'],
            'conditions': response['conditions'],
            'img': response['img']
        }
        result = jsonify(project)
    else:
        result = Response(
            '{"status_message": "The resource you requested could not be found."}',
            status=404,
            mimetype='application/json'
        )
    return result


@app.route('/project/<project_id>', methods=["DELETE"])
def delete_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        response = projects.remove({'_id': ObjectId(project_id)})
        if response:
            result = Response(
                '{"status_message": "The item was deleted successfully."}',
                status=200,
                mimetype='application/json'
            )
    else:
        result = Response(
            '{"status_message": "The resource you requested could not be found."}',
            status=404,
            mimetype='application/json'
        )
    return result


@app.route('/project/<project_id>', methods=["PUT"])
def update_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        project_name = request.get_json()['project_name']
        conditions = request.get_json()['conditions']
        img = request.get_json()['img']
        updated = datetime.utcnow()

        projects.update_one({'_id': ObjectId(project_id)}, { '$set': {
            'project_name': project_name,
            'conditions': conditions,
            'img': img,
            'updated': updated
        }}, upsert=False)

        return jsonify({'status_message': project_name + ' was updated successfully.'})
    else:
        result = Response(
            '{"status_message": "The resource you requested could not be found."}',
            status=404,
            mimetype='application/json'
        )
    return result

if __name__ == '__main__':
    app.run(debug=True)
