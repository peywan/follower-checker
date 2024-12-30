import logging

logging.basicConfig(level=logging.DEBUG)

@app.route('/api/compare', methods=['POST'])
def compare_files():
    if 'followers' not in request.files or 'following' not in request.files:
        return jsonify({"error": "Both files are required"}), 400

    followers_file = request.files['followers']
    following_file = request.files['following']

    try:
        # Parse followers file
        followers_html = followers_file.read().decode('utf-8')
        followers_soup = BeautifulSoup(followers_html, 'html.parser')
        followers = [tag.text.strip() for tag in followers_soup.find_all('a')]
        logging.debug(f"Followers: {followers}")

        # Parse following file
        following_html = following_file.read().decode('utf-8')
        following_soup = BeautifulSoup(following_html, 'html.parser')
        following = [tag.text.strip() for tag in following_soup.find_all('a')]
        logging.debug(f"Following: {following}")

        # Find users not following back
        not_following_back = list(set(following) - set(followers))
        logging.debug(f"Not Following Back: {not_following_back}")

        results = [{"username": user, "profileLink": f"https://instagram.com/{user}"} for user in not_following_back]
        return jsonify({"notFollowingBack": results})
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
