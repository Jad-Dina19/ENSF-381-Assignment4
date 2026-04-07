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
    email_regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    password_regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

    if not re.match(username_regex, username):
        return flask.jsonify({
                'message': 'Invalid username, Must be 3- 20 characters, start with a letter, and can contain letters, numbers, and underscores.',
                'success': False
                })
    if not re.fullmatch(email_regex, email):
        return flask.jsonify({
                'message': 'Invalid email, Must be in form -------@----.----',
                'success': False
                })
    if not re.fullmatch(password_regex, password):
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
        'id': len(users) + 1,
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
            stored_hash = user.get('password_hash', '')
            if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
                return flask.jsonify({
                    'message': 'Login successful',
                    'success': True,
                    'userId': user.get('id'),     
                    'username': user.get('username')
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
        if(user['id'] == user_id):
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



@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = flask.request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')

    with open('users.json', 'r') as f:
        users = json.load(f)
    
    with open('flavours.json', 'r') as f:
        flavors = json.load(f)

    selected_flavor = next((f for f in flavors if f['id'] == flavor_id), None)
    if not selected_flavor:
        return flask.jsonify({"success": False, "message": "Flavor not found."}), 404

    for user in users:
        if user.get('id') == user_id:
            if any(item['flavorId'] == flavor_id for item in user['cart']):
                return flask.jsonify({"success": False, "message": "Flavor already in cart. Use PUT to update quantity."}), 400
            
            user['cart'].append({
                "flavorId": selected_flavor['id'],
                "name": selected_flavor['name'],
                "price": float(selected_flavor['price'].replace('$', '')),
                "quantity": 1
            })
            
            with open('users.json', 'w') as f:
                json.dump(users, f, indent=4)
            return flask.jsonify({"success": True, "message": "Flavor added to cart.", "cart": user['cart']})

    return flask.jsonify({"success": False, "message": "User not found."}), 404

@app.route('/cart', methods=['PUT'])
def update_cart():
    data = flask.request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    quantity = data.get('quantity')

    if quantity < 1:
        return flask.jsonify({"success": False, "message": "Quantity must be at least 1."}), 400

    with open('users.json', 'r') as f:
        users = json.load(f)

    for user in users:
        if user.get('id') == user_id:
            for item in user['cart']:
                if item['flavorId'] == flavor_id:
                    item['quantity'] = quantity
                    with open('users.json', 'w') as f:
                        json.dump(users, f, indent=4)
                    return flask.jsonify({"success": True, "message": "Cart updated successfully.", "cart": user['cart']})
            
            return flask.jsonify({"success": False, "message": "Flavor not in cart."}), 404

    return flask.jsonify({"success": False, "message": "User not found."}), 404

@app.route('/cart', methods=['DELETE'])
def delete_cart_item():
    data = flask.request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')

    with open('users.json', 'r') as f:
        users = json.load(f)

    for user in users:
        if user.get('id') == user_id:
            user['cart'] = [item for item in user['cart'] if item['flavorId'] != flavor_id]
            with open('users.json', 'w') as f:
                json.dump(users, f, indent=4)
            return flask.jsonify({"success": True, "message": "Flavor removed from cart.", "cart": user['cart']})

    return flask.jsonify({"success": False, "message": "User not found."}), 404

@app.route('/orders', methods=['POST'])
def place_order():
    data = flask.request.get_json()
    user_id = data.get('userId')

    with open('users.json', 'r') as f:
        users = json.load(f)

    for user in users:
        if user.get('id') == user_id:
            if not user['cart']:
                return flask.jsonify({"success": False, "message": "Cart is empty."}), 400

            new_order = {
                "orderId": len(user['orders']) + 1,
                "items": list(user['cart']),
                "total": sum(item['price'] * item['quantity'] for item in user['cart']),
                "timestamp": "2026-04-06 17:00:00"
            }
            
            user['orders'].append(new_order)
            user['cart'] = []
            
            with open('users.json', 'w') as f:
                json.dump(users, f, indent=4)
            return flask.jsonify({"success": True, "message": "Order placed successfully.", "orderId": new_order['orderId']})

    return flask.jsonify({"success": False, "message": "User not found."}), 404

@app.route('/orders', methods=['GET'])
def get_orders():
    
    user_id = flask.request.args.get('userId', type=int) 

    if user_id is None:
        return flask.jsonify({"success": False, "message": "Missing userId"}), 400

    with open('users.json', 'r') as f:
        users = json.load(f)

    for user in users:
       
        if user.get('id') == user_id: 
            return flask.jsonify({
                "success": True, 
                "message": "Order history loaded.", 
                "orders": user.get('orders', [])
            })

    return flask.jsonify({"success": False, "message": "User not found."}), 404



if __name__ == '__main__':
    app.run(debug=True)
    password = "password123"
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    print(password_hash)







