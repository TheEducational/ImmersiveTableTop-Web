#!/usr/bin/python3
import subprocess
import requests
import time
import datetime
import logging
from flask import Flask, render_template, request, url_for, flash, redirect, jsonify
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
import json

# ---------------- Globals ------------------

mode = "" # Gamemode (frosthaven or twilight imperium currently supported)
password = "frost" # Set a password for the web application admin panel
music_type_frost = ["Intermission", "Combat", "Victory", "Boss"]
music_type_ti = ["Combat", "Idle", "Pre-Game"]
background_type_frost = ["Outpost", "Boss", "SummerCombat", "WinterCombat"]
players_filepath = "./static/data/players.json" # File containing the player names
objectives_filepath = "./static/data/objectives.json" # File containing public objectives
music_filepath = "./static/data/music.json"
app = Flask(__name__)
auth = HTTPBasicAuth()
users = { "" : generate_password_hash(password) } # Leave username for blank
currently_playing_song = "" # Currently playing song
currently_playing_video = "" # Currently playing video

# Logging
log_filepath = "./static/data/log.txt" # Name of file used for logging
GAME_LEVEL = 25 # Logging verbosity level for the custom logging level only used for logging game actions performed in the admin panel
logging.addLevelName(GAME_LEVEL, "GAME")
logger = logging.getLogger(__name__)

# -------------------------------------------

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

def get_news_texts(newsFile):
    delimiter = " /// "
    with open(newsFile, 'r') as f: lines = f.readlines()
    random.shuffle(lines) # Randomize list
    new_text = delimiter
    for line in lines:
        new_text += line.strip() + delimiter
    return new_text

@app.route('/admin/music/', methods=('GET', 'POST'))
@auth.login_required
def change_music():
    try:
        if request.method == 'GET':
            return render_template("music.html")
        elif request.method == 'POST':
            # Parse the JSON data from the request
            data = request.get_json()
        
            # Check if the data contains the expected structure for updating the current music time
            if data and 'currentlyPlaying' in data:
                new_currently_playing = data['currentlyPlaying']  # Extract the song info (songId, currentTime, maxTime)

                # Read the existing music.json file
                with open(music_filepath, 'r') as file:
                    music_data = json.load(file)

                # Update the currentlyPlaying section with the new values
                music_data['currentlyPlaying']['songId'] = new_currently_playing.get('songId')
                music_data['currentlyPlaying']['currentTime'] = new_currently_playing.get('currentTime')
                music_data['currentlyPlaying']['maxTime'] = new_currently_playing.get('maxTime')

                # Write the updated data back to the music.json file
                with open(music_filepath, 'w') as file:
                    json.dump(music_data, file, indent=4)

                return jsonify({'Status': "currentlyPlaying successfully changed."}), 200
            
            # Check if the data only has the override field, in which case only reset the override field
            if data and 'override' in data:
                new_override = data["override"]

                # Read the existing music.json file
                with open(music_filepath, 'r') as file:
                    music_data = json.load(file)

                # Update the override 
                music_data['override'] = new_override

                # Write the updated data back to the music.json file
                with open(music_filepath, 'w') as file:
                    json.dump(music_data, file, indent=4)

                return jsonify({'Status': "override successfully changed."}), 200
        
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid data"}), 400

@app.route('/admin/', methods=['GET'])
@auth.login_required
def admin_panel():
    # Different admin_panel pages for different game modes
    if (mode == "ti"):
        admin_panel = "admin-panel-ti.html"
    elif (mode == "frost"):
        admin_panel = "admin-panel-frost.html"

    return render_template(admin_panel)

# Returns a list of music files in a given directory, which is then passed into the respective HTML pages through jinja templates.
def get_music(music_type):
    try:
        filenames = os.listdir("static/Music/TI4/{music_type}".format(music_type=music_type))
        return ["Music/TI4/{music_type}/{file}".format(music_type=music_type, file=f) for f in filenames if os.path.isfile(os.path.join("static/Music/TI4/{music_type}".format(music_type=music_type), f))]
    except Exception as e:
        print("[*] Error Excepted: {e}".format(e=e))

def get_videos(video_type):
    try:
        filenames = os.listdir("static/Videos/TI4/{video_type}".format(video_type=video_type))
        return ["Videos/TI4/{video_type}/{file}".format(video_type=video_type, file=f) for f in filenames if os.path.isfile(os.path.join("static/Videos/TI4/{video_type}".format(video_type=video_type), f))]
    except Exception as e:
        print("[*] Error Excepted: {e}".format(e=e))
    
@app.route('/ti-peace', methods=['GET'])
def ti_peace():
    try:
        headlines = get_news_texts('static/data/sourcetexts-peace.txt')
        music = get_music("Peace")
        videos = get_videos("Peace")
        return render_template("ti-peace.html", headlines=headlines, music=music, videos=videos)
    except Exception as e:
        print(e)

@app.route('/admin/players', methods=['GET'])
@auth.login_required
def ti_players():
    return render_template("players.html")

# When the players in the players management admin panel are updated
@app.route('/admin/players', methods=['POST'])
@auth.login_required
def ti_update_players():
    try:
        new_data = request.get_json()
        with open(players_filepath, 'w') as file:
            json.dump(new_data, file, indent=4)
        return jsonify({"message": "New Player data saved successfully!"}), 200
    except Exception as e:
        print("Error when updating players file")
        print(e)

@app.route('/admin/objectives', methods=['GET'])
@auth.login_required
def ti_objectives():
    return render_template("objectives.html")

# When the players in the players management admin panel are updated
@app.route('/admin/objectives', methods=['POST'])
@auth.login_required
def ti_update_objectives():
    try:
        new_data = request.get_json()
        with open(objectives_filepath, 'w') as file:
            json.dump(new_data, file, indent=4)
        return jsonify({"message": "New Objective data saved successfully!"}), 200
    except Exception as e:
        print("Error when updating objectives file")
        print(e)

@app.route('/admin/log', methods=['GET'])
@auth.login_required
def view_log():
    return render_template("view-log.html")

@app.route('/admin/log', methods=['POST'])
@auth.login_required
def log_message():
    data = request.json
    message = data.get('message', '')
    print(message)
    message += " [{local_ip}]".format(local_ip=request.remote_addr)
    logger.game(message)

    return jsonify({"status": "success"}), 200

def game_logging_level(self, message, *args, **kwargs):
    if self.isEnabledFor(GAME_LEVEL):
        self._log(GAME_LEVEL, message, args, **kwargs)

@app.route('/', methods=['GET'])
def index():
    match mode:
        case "ti":
            setup_dir = os.path.join(app.static_folder, 'Music/TI4/Pre-Game')
            audio_files = [f for f in os.listdir(setup_dir) if f.endswith('.mp3')]
            setup_song = random.choice(audio_files)
            setup_song = 'Music/TI4/Pre-Game/'+setup_song
            return render_template("ti-setup.html", setup_song=setup_song)
        case "frost":
            pass

def start_ti():
    pass

def start_frost():
    # Start Music and Background
    pass

def main():
    # Start logging
    global logger  # Declare the logger as global here
    logging.Logger.game = game_logging_level
    
    # Set up logging configuration
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)  # Set the desired logging level (DEBUG, INFO, etc.)
    
    # Create a file handler to log to a specific file
    file_handler = logging.FileHandler(log_filepath)
    file_handler.setLevel(logging.DEBUG)  # You can set the level for the file handler here

    # Create a logging format
    formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(formatter)

    # Add the file handler to the logger
    logger.addHandler(file_handler)

    # Global variable "mode" defines what mode to start the program in, frost or TI
    global mode

    # Ask the user for the mode
    #while (True):
    #    mode = input('Enter the mode ("frost" for Frosthaven, "ti" for Twilight Imperium): ')
    #    if (mode != "frost" and mode != "ti"):
    #        print("Please enter a valid mode.")
    #    else:
    #        break
    mode = "ti"
    print("Starting ImmsersiveTableTop in '{mode}' mode...".format(mode=mode))

    if (mode == "frost"):
        start_frost()
    elif (mode == "ti"):
        start_ti()

    # Uncomment the line below to start in development mode
    #app.run(host="0.0.0.0", debug=False) 

main()