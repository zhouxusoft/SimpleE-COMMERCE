from flask import Flask, redirect, render_template

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/main')
def main():
    return redirect('https://godxu.top')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)