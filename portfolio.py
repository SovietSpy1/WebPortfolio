import sqlite3
import os

from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_mail import Mail, Message

import json

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'   # e.g. Gmail SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'michaelbiggar2005@gmail.com'
app.config['MAIL_PASSWORD'] = 'vsuk punb hmjn okdk'
mail = Mail(app)
@app.route('/', methods=(['GET']))
def index():
	return render_template("index.html")
@app.route('/contact', methods = (['POST']))
def contact():
	data = request.get_json()
	firstName = data.get("firstName");
	lastName = data.get("lastName");
	email = data.get('email')
	phone = data.get('phone')
	subject = data.get('subject')
	message = data.get('message')
	msg = Message(subject="New message from your portfolio",
				  sender=app.config['MAIL_USERNAME'],
				  recipients=['michaelbiggar2005@outlook.com'],
				  html=f"""
	                  <h1>New Message</h1>
	                  <p><b>Name:</b> {firstName} {lastName}</p>
	                  <p><b>Email:</b> {email}</p>
	                  <p><b>Phone:</b> {phone}</p>
	                  <p><b>Subject:</b> {subject}</p>
	                  <p><b>Message:</b> {message}</p>
	                  """)
	mail.send(msg)
	return json.dumps({"status": "1"});
if (__name__ == '__main__'):
	app.run(host='0.0.0.0', port=5000, debug=True)
	#app.run(host='127.0.0.1', port=5000, debug=True)