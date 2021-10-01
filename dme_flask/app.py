from flask import Flask, json, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'dmelogindb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/dmelogindb'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

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
            result = jsonify({"error": "Invalid username and password"})
    else:
        result = jsonify({"result": "No results found"})
    return result


# Send request to DomainExtractor.
# get json [(“informtion”, 7, [“information”, ...]), ...] or txt file
# return json file
def get_misspell_from_NLP(win_cond):
    # TO BE ADDED (connection to DomainExtractor)
    # send misspell check request to DomainExtractor
    # get list of unknown words and replace suggestion
    msg1 = {"option": "Change Line 27: Word: webcraweler Change to: webcrawler"}
    msg2 = [("worrd", 1, ["word", "world"]), ("nigh", 2, ["night", "high"])]
    json_file = json.dumps(msg2)
    return json_file


# This endpoint will be used to check misspell of user input
# The user input will be sent to DomainExtractor to run Step 1.
# Return string (will be replaced with json)
@app.route('/check', methods=['POST'])
def search_for_misspell():
    win_cond = request.data.decode('UTF-8')
    if win_cond:
        return get_misspell_from_NLP(win_cond)
    return "No win condition is given"


# Send request to DomainExtractor
# get link to the image
# return json in following format {img: link}
def get_result_VM_from_NLP(win_cond):
    # TO BE ADDED (connection to DomainExtractor)
    # send generate request to DomainExtractor
    # get image link
    return {"img": "https://via.placeholder.com/600/92c952"}


# this endpoint will be used to get user stories/win condition
# and using them retrieve the Visualize the domain model from
# the DomainExtractor (Step 2 through 5)
@app.route('/generate', methods=['POST'])
def get_result_img():
    win_cond = request.data.decode('UTF-8')
    if win_cond:
        return get_result_VM_from_NLP(win_cond)
    return "No win condition is given"

if __name__ == '__main__':
    app.run(debug=True)
