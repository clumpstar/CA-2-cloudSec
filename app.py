from flask import Flask, render_template
from flask import request
import json

import os
from supabase import create_client, Client

url: str = ""
key: str = ""
supabase: Client = create_client(url, key)

app = Flask(__name__)

# Route for the home page
@app.route('/')
def home():
    return render_template('home.html')

# Route for displaying the uploaded files table
@app.route('/file_list')
def file_list():
    # Logic to fetch uploaded files from AWS S3 and pass them to the template
    uploaded_files = []  # Replace this with actual logic to fetch uploaded files
    return render_template('file_list.html', uploaded_files=uploaded_files)

@app.route('/upload', methods=['POST'])
def upload():
    print("Received data:", request.data)  # Print the raw data received
    print("Type of request.data:", type(request.data))  # Print the type of the received data
    try:
        file_details = json.loads(request.data)  # Convert the received data to a Python object
        file_name = file_details["name"]
        file_size = str(file_details["size"]) + "Kb"
        bucketName = file_details["bucketName"]
        print(file_name, file_size, bucketName)
        
        data, count = supabase.table('MetaDataFileStorage').insert({"id": 1, "file_name": file_name, "file_size": file_size, "bucket_name": bucketName}).execute()

        return 'File details received successfully!', 200
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return 'Error decoding JSON', 400

@app.route('/delete', methods=['POST'])
def delete():
    print("Received data:", request.data)  # Print the raw data received
    print("Type of request.data:", type(request.data))  # Print the type of the received data
    try:
        file_details = json.loads(request.data)  # Convert the received data to a Python object
        file_name = file_details["name"]
        
        data, count = supabase.table('MetaDataFileStorage').delete().eq('file_name', file_name).execute()
        
        return 'File details received successfully!', 200
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return 'Error decoding JSON', 400

if __name__ == '__main__':
    app.run(debug=True)
