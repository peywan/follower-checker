from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

@app.route('/api/compare', methods=['POST'])
def compare_files():
    if 'followers' not in request.files or 'following' not in request.files:
        return jsonify({'error': 'Both files are required!'}), 400

    followers_file = request.files['followers']
    following_file = request.files['following']

    try:
        # Read the files
        followers = set(followers_file.read().decode('utf-8').splitlines())
        following = set(following_file.read().decode('utf-8').splitlines())

        # Find users not following back
        not_following_back = list(following - followers)

        return jsonify({'notFollowingBack': not_following_back})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
