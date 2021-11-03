from flask import Flask, json, jsonify, request, Response, render_template
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_login import LoginManager, login_user, login_required

import base64
#from dme_ui_api.api_functions import *

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'dmelogindb'
# app.config['MONGO_URI'] = 'mongodb://dmeuser:25MKMUp5vKBEpdn4@ec2-54-153-23-218.us-west-1.compute.amazonaws.com:27017/dmelogindb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/dmelogindb'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['MONGO_DBNAME'] = 'dmedb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/dmedb'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo_dme = PyMongo(app)
app.secret_key = b'secret'
login = LoginManager(app)
login.login_view = 'login'

CORS(app)


@app.route('/')
def index():
    return render_template('index.html')

    @staticmethod
    def is_authenticated():
        return True

    @staticmethod
    def is_active():
        return True

    @staticmethod
    def is_anonymous():
        return False

    def get_id(self):
        print("get_id: " + str(self.user_id), flush=True)
        return self.user_id

    @login.user_loader
    def load_user(user_id):
        print("user_loader: ", user_id, flush=True)
        u = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not u:
            return None
        return User(user_id=u['_id'])

    @login.unauthorized_handler
    def unauthorized_callback():
        print("unauthorized", flush=True)
        return flask.redirect('http://localhost:3000/')

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
                user_obj = User(user_id=str(response['_id']))
                print("This id was added to User " +
                      str(response['_id']), flush=True)
                login_user(user_obj, remember=True)
                result = jsonify({'token': access_token})
                next = request.args.get('next')
                if (next):
                    return flask.redirect(next)
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
@login_required
def search_for_misspell():
    json_data = json.loads(str(request.data, encoding='utf-8'))
    input_str_list = json_data["userInput"].split("\n")
    result_msg = api_misspelling(input_str_list)
    result = {"option": result_msg}
    return jsonify(result)


@app.route('/model', methods=['POST'])
@login_required
def get_result_img():
    json_data = json.loads(str(request.data, encoding='utf-8'))
    input_str_list = json_data["userInput"].split("\n")
    output = api_diagram_generator(input_str_list)

    return jsonify({"format": output[1], "content": output[0], "msg": output[2]})


@app.route('/project', methods=["POST"])
@login_required
def create_project():
    projects = mongo_dme.db.projects
    project_name = request.get_json()['project_name']
    created = datetime.utcnow()
    print(flask_login.current_user, flush=True)
    project_id = projects.insert({
        'project_name': project_name,
        'created_by': flask_login.current_user.user_id,
        'created': created
    })

    new_project = projects.find_one({'_id': project_id})

    return jsonify({'status_message': new_project['project_name'] + ' was created successfully.'})


@app.route('/project/<project_id>', methods=["GET"])
@login_required
def get_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        if response['created_by'] != flask_login.current_user.user_id:
            result = Response(
                '{"status_message": "Access Denied: You do not have permissions to access the service."}',
                status=403,
                mimetype='application/json'
            )
        else:
            project = {
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
@login_required
def delete_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        if response['created_by'] != flask_login.current_user.user_id:
            result = Response(
                '{"status_message": "Access Denied: You do not have permissions to access the service."}',
                status=403,
                mimetype='application/json'
            )
        else:
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
@login_required
def update_project(project_id):
    projects = mongo_dme.db.projects
    response = projects.find_one({'_id': ObjectId(project_id)})
    if response:
        if response['created_by'] != flask_login.current_user.user_id:
            result = Response(
                '{"status_message": "Access Denied: You do not have permissions to access the service."}',
                status=403,
                mimetype='application/json'
            )
        else:
            project_name = request.get_json()['project_name']
            conditions = request.get_json()['conditions']
            img = request.get_json()['img']
            updated = datetime.utcnow()

            projects.update_one({'_id': ObjectId(project_id)}, {'$set': {
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
