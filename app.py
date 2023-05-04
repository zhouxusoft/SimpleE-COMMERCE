from flask import Flask, redirect, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/main')
def main():
    return redirect('https://godxu.top')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['name'] == 'godxu' and data['password'] == '123456':
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
