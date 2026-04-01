import bcrypt
import flask
from flask_cors import CORS
import json
import re
import random

app = flask.Flask(__name__)
CORS(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = flask.request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    users = None
    with open('users.json', 'r') as f:
        users = json.load(f)
    
    username_regex = r'^[A-Za-z][a-zA-Z0-9_]{3,20}$'
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    password_regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

    if not re.match(username_regex, username):
        return flask.jsonify({
                'message': 'Invalid username, Must be 3- 20 characters, start with a letter, and can contain letters, numbers, and underscores.',
                'success': False
                })
    if not re.match(email, email_regex):
        return flask.jsonify({
                'message': 'Invalid email, Must be in form -------@----.----',
                'success': False
                })
    if not re.match(password, password_regex):
        return flask.jsonify({
                'message': 'Invalid password, must have one uppercase letter, one lowercase letter, a digit, special character, and must be at least 8 digits',
                'success': False
                })
    
    for user in users:
        if(user['username'] == username):
            return flask.jsonify({
                'message': 'Username is already taken',
                'success': False
                })
        
        if(user['email'] == email):
            return flask.jsonify({
                'message': f'Email {email} has already signed up',
                'success': False
                })

    user = {
        'username': username,
        'email': email,
        'password_hash': bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'cart': [],   
        'orders': []
    }
    users.append(user)
    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)
    
    return flask.jsonify({
        'message': 'User created successfully',
        'success': True
    })

@app.route('/login', methods=['POST'])
def login():
    data = flask.request.get_json()

    username = data['username']
    password = data['password']

    users = None
    with open('users.json', 'r') as f:
        users = json.load(f)

    for user in users:
        if user['username'] == username:
            if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return flask.jsonify({
                    'message': 'Login successful',
                    'success': True
                })
            else:
                return flask.jsonify({
                    'message': 'Incorrect password',
                    'success': False
                })

    return flask.jsonify({
        'message': 'Username not found',
        'success': False
    })

@app.route('/reviews', methods=['GET'])
def load_reviews():
    reviews = None
    with open('reviews.json','r') as f:
        reviews = json.load(f)
    
    rev_list = []
    for i in range(2):
        index = random.randint(0, len(reviews) - 1)
        rev_list.append(reviews[index])

    if(len(rev_list) == 0):
        return flask.jsonify({
        'success': False,
        'message': "Reviews failed to load.",
    })

    
    
    return flask.jsonify({
        'success': True,
        'message': "Reviews loaded.",
        'reviews': rev_list
    })

@app.route('/flavours', methods=['GET'])
def load_flavours():
    flavours = None
    with open('flavours.json', 'r') as f:
        flavours = json.load(f)
    
    if(flavours is None):
        return flask.jsonify({
            'success': False,
            'message': 'Flavours failed to load'
        })
    
    return flask.jsonify({
        'success': True,
        'message': "Flavours Loaded.",
        'flavours': flavours
    })

@app.route('/cart', methods=['GET'])
def get_cart():
    user_id = flask.request.args.get('userId')

    if user_id is None:
        return flask.jsonify({
            'success': False,
            'message': 'Missing userID.'
        })
    
    try:
        user_id = int(user_id)
    except ValueError:
        return flask.jsonify({
            "success": False,
            "message": "userId must be an integer."
        })

    users = None
    with open("users.json", 'r') as f:
        users = json.load(f)

    if(users is None):
        return flask.jsonify({
            "success": False,
            "message": "No users are in the system"
        })
    
    for user in users:
        if(user['if'] == user_id):
            cart = user['cart']
            return flask.jsonify({
                'success': True,
                'message': 'Cart loaded.',
                'cart': cart
            })
    
    return flask.jsonify({
    "success": False,
    "message": f"User {user_id} not found."
    })










