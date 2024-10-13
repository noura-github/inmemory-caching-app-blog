from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


james_bond_films = [
    {"id": 10, "title": "No Time to Die", "year": 2021, "starring": "Daniel Craig", "directedBy": "Cary Joji Fukunaga"},
    {"id": 20, "title": "Die Another Day", "year": 2002, "starring": "Pierce Brosnan", "directedBy": "Lee Tamahori"},
    {"id": 30, "title": "The Living Daylights", "year": 1987, "starring": "Timothy Dalton", "directedBy": "John Glen"},
    {"id": 40, "title": "A View to a Kill", "year": 1985, "starring": " Roger Moore", "directedBy": "John Glen"},
    {"id": 50, "title": "Never Say Never Again", "year": 1983, "starring": "Sean Connery", "directedBy": "Irvin Kershner"},
]

# Route for Home Page
@app.route('/')
def index():
    return render_template('index.html')


# Helper function to search for an item in a list
def search(id, ls):
    result = [element for element in ls if element["id"] == id]
    if len(result) > 0:
        return result[0]
    return None


# Route to handle AJAX POST request
@app.route('/load_film_data', methods=['POST'])
def get_film_data():
    # Get JSON data from request
    data = request.get_json()

    film_id = data.get('filmId')
    film_data = search(int(film_id), james_bond_films)
    print("Found film data: ", film_data)

    # Send a JSON response back to the client
    return jsonify({
        'status': 'success',
        'film_data': film_data
    })


if __name__ == '__main__':
    app.run(debug=True)
