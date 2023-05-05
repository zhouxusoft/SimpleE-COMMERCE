from flask import Flask, redirect, render_template, request, jsonify
import mysql.connector

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="e-commerce"
)

dbcursor = db.cursor()

dbcursor.execute("CREATE DATABASE IF NOT EXISTS mydatabase")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `buyers` (\
                    Buyers_id int NOT NULL AUTO_INCREMENT,\
                    Buyers_name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Buyers_password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Buyers_address varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Buyers_email varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Buyers_phone varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    PRIMARY KEY (Buyers_id) USING BTREE)\
                    ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=Dynamic")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `vendors` (\
                    Vendors_id int NOT NULL AUTO_INCREMENT,\
                    Vendors_name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Vendors_password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Vendors_address varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Vendors_email varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    Vendors_phone varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    PRIMARY KEY(Vendors_id) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic")


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
    if data['kinds'] == 'buyer':
        sql = "SELECT * FROM buyers WHERE Buyers_name = %s"
        val = (data['name'],)
        dbcursor.execute(sql, val)
        result = dbcursor.fetchall()
        if str(result[0][2]) == data['password']:
            userinfo = []
            userinfo = {
                'id': result[0][0],
                'name': result[0][1],
                'address': result[0][3],
                'email': result[0][4],
                'phone': result[0][5]
            }
            return jsonify({'success': True, 'userinfo': userinfo})
        else:
            return jsonify({'success': False})

@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
