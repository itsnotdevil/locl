from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            emoji TEXT DEFAULT '🌞'
        )
    ''')
    conn.commit()
    conn.close()

def update_db_schema():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in c.fetchall()]
    if "emoji" not in columns:
        c.execute("ALTER TABLE users ADD COLUMN emoji TEXT DEFAULT '🌞'")
        conn.commit()
    conn.close()

init_db()
update_db_schema()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)',
                  (data['fullname'], data['username'], data['email'], data['password']))
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Account created!'})
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': 'Email already exists!'})
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email=? AND password=?', (data['email'], data['password']))
    user = c.fetchone()
    conn.close()
    if user:
        return jsonify({'status': 'success', 'message': 'Login successful!'})
    else:
        return jsonify({'status': 'error', 'message': 'Wrong email or password!'})

@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    if data['username'] == 'admin' and data['password'] == 'admin1234':
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid admin credentials'})

@app.route('/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('SELECT id, fullname, username, email, password, emoji FROM users')
    users = c.fetchall()
    conn.close()
    return jsonify({'users': users})

@app.route('/update-user', methods=['POST'])
def update_user():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('UPDATE users SET fullname=?, username=?, email=?, password=?, emoji=? WHERE id=?',
              (data['fullname'], data['username'], data['email'], data['password'], data['emoji'], data['id']))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/delete-user', methods=['POST'])
def delete_user():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('DELETE FROM users WHERE id=?', (data['id'],))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)