from flask import Flask, request, Response, send_file
from flask_cors import CORS
import cloudscraper
scraper = cloudscraper.create_scraper()

burp0_cookies = {"__Secure-next-auth.session-token": "a6f35133-dea1-48d2-94c3-c2ea42394b29"}


app = Flask(__name__)
CORS(app)

@app.route('/')
def select_course():
    return send_file('static/html/selectCourse.html')

@app.route('/viewCourse')
def view_course():
    return send_file('static/html/viewCourse.html')


@app.route('/api')
def reverse_proxy():
    query_url = request.args.get('query')
    if not query_url:
        return 'No query URL provided', 400

    response = scraper.get(query_url,cookies=burp0_cookies)
    if response.status_code != 200 and response.status_code != 207 :
        print(response.content)
        return 'Error fetching URL', response.status_code

    return Response(response.content, content_type=response.headers['content-type'])

if __name__ == '__main__':
    app.run(debug=True)
