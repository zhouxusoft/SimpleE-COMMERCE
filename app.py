from flask import Flask, redirect, render_template, request, jsonify
import mysql.connector

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="ecommerce",
    charset="utf8mb4"
)

dbcursor = db.cursor()

dbcursor.execute("CREATE DATABASE IF NOT EXISTS ecommerce")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `buyers` (\
                    `Buyers_id` int NOT NULL AUTO_INCREMENT,\
                    `Buyers_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Buyers_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Buyers_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Buyers_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Buyers_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    PRIMARY KEY (`Buyers_id`) USING BTREE)\
                    ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=Dynamic")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `vendors` (\
                    `Vendors_id` int NOT NULL AUTO_INCREMENT,\
                    `Vendors_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Vendors_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Vendors_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Vendors_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Vendors_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    PRIMARY KEY(`Vendors_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `catagories`  (\
                    `Catagories_id` int NOT NULL AUTO_INCREMENT,\
                    `Catagory_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,\
                    PRIMARY KEY (`Catagories_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `products`  (\
                    `Product_id` int NOT NULL AUTO_INCREMENT,\
                    `Product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Post_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                    `Product_describe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Price` decimal(10, 2) NULL DEFAULT NULL,\
                    `Inventory` int NULL DEFAULT NULL,\
                    `Like_sum` int NOT NULL DEFAULT 0,\
                    `Dislike_sum` int NOT NULL DEFAULT 0,\
                    `Comment_sum` int NOT NULL DEFAULT 0,\
                    `Vendors_id` int NULL DEFAULT NULL,\
                    `Category_id` int NULL DEFAULT NULL,\
                    PRIMARY KEY (`Product_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `like`  (\
                    `Like_id` int NOT NULL AUTO_INCREMENT,\
                    `Like_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                    `Product_id` int NULL DEFAULT NULL,\
                    `Buyer_id` int NULL DEFAULT NULL,\
                    PRIMARY KEY (`Like_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `dislike`  (\
                    `Dislike_id` int NOT NULL AUTO_INCREMENT,\
                    `Dislike_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                    `Product_id` int NULL DEFAULT NULL,\
                    `Buyer_id` int NULL DEFAULT NULL,\
                    PRIMARY KEY (`Dislike_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `comment`  (\
                    `Comment_id` int NOT NULL AUTO_INCREMENT,\
                    `Conent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,\
                    `Comment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                    `Buyer_id` int NULL DEFAULT NULL,\
                    `Buyer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Vendor_id` int NULL DEFAULT NULL,\
                    `Product_id` int NULL DEFAULT NULL,\
                    PRIMARY KEY (`Comment_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")

dbcursor.execute("CREATE TABLE IF NOT EXISTS `Order`  (\
                    `Order_id` int NOT NULL AUTO_INCREMENT,\
                    `Arrive_date` date NULL DEFAULT NULL,\
                    `Tracking` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,\
                    `Order_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                    `Quantity` int NULL DEFAULT NULL,\
                    `Sum_price` decimal(10, 2) NULL DEFAULT NULL,\
                    `Vender_id` int NULL DEFAULT NULL,\
                    `Product_id` int NULL DEFAULT NULL,\
                    `Buyer_id` int NULL DEFAULT NULL,\
                    PRIMARY KEY (`Order_id`) USING BTREE)\
                    ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;")


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['kinds'] == 'buyer':
        sql = "SELECT * FROM buyers WHERE Buyers_name = %s"
        val = (data['name'],)
        dbcursor.execute(sql, val)
        result = dbcursor.fetchall()
        if len(result) > 0:
            if str(result[0][2]) == data['password']:
                userinfo = []
                userinfo = {
                    'id': result[0][0],
                    'name': result[0][1],
                    'address': result[0][3],
                    'email': result[0][4],
                    'phone': result[0][5],
                    'kinds': 'buyer'
                }
                return jsonify({'success': True, 'userinfo': userinfo})
            else:
                return jsonify({'success': False, 'message': 'Username or password incorrect'})
        else:
            return jsonify({'success': False, 'message': 'Username or password incorrect'})
    else:
        sql = "SELECT * FROM vendors WHERE Vendors_name = %s"
        val = (data['name'],)
        dbcursor.execute(sql, val)
        result = dbcursor.fetchall()
        if len(result) > 0:
            if str(result[0][2]) == data['password']:
                userinfo = []
                userinfo = {
                    'id': result[0][0],
                    'name': result[0][1],
                    'address': result[0][3],
                    'email': result[0][4],
                    'phone': result[0][5],
                    'kinds': 'ventor'
                }
                return jsonify({'success': True, 'userinfo': userinfo})
            else:
                return jsonify({'success': False, 'message': 'Username or password incorrect'})
        else:
            return jsonify({'success': False, 'message': 'Username or password incorrect'})


@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()
    if data['kinds'] == 'vendor':
        sql = "SELECT * FROM vendors WHERE Vendors_name = %s"
        val = (data['name'],)
        dbcursor.execute(sql, val)
        result = dbcursor.fetchall()
        if len(result) > 0:
            return jsonify({'success': False, 'message': 'That username has already been taken'})
        else:
            sql = "INSERT INTO vendors (Vendors_name, Vendors_password, Vendors_address, Vendors_email, Vendors_phone) VALUES (%s, %s, %s, %s, %s)"
            val = (data['name'], data['password'],
                   data['address'], data['email'], data['phone'])
            dbcursor.execute(sql, val)
            db.commit()
            return jsonify({'success': True, 'message': 'Registration successful'})
    else:
        sql = "SELECT * FROM buyers WHERE Buyers_name = %s"
        val = (data['name'],)
        dbcursor.execute(sql, val)
        result = dbcursor.fetchall()
        if len(result) > 0:
            return jsonify({'success': False, 'message': 'That username has already been taken'})
        else:
            sql = "INSERT INTO buyers (Buyers_name, Buyers_password, Buyers_address, Buyers_email, Buyers_phone) VALUES (%s, %s, %s, %s, %s)"
            val = (data['name'], data['password'],
                   data['address'], data['email'], data['phone'])
            dbcursor.execute(sql, val)
            db.commit()
            return jsonify({'success': True, 'message': 'Registration successful'})


@app.route('/getinfo', methods=['POST'])
def getinfo ():
    sql = "SELECT * FROM `products`"
    dbcursor.execute(sql)
    productresult = dbcursor.fetchall()
    sql = "SELECT * FROM `catagories`"
    dbcursor.execute(sql)
    catagoriesresult = dbcursor.fetchall()
    sql = "SELECT * FROM `like`"
    dbcursor.execute(sql)
    likeresult = dbcursor.fetchall()
    sql = "SELECT * FROM `dislike`"
    dbcursor.execute(sql)
    dislikeresult = dbcursor.fetchall()
    sql = "SELECT * FROM `comment`"
    dbcursor.execute(sql)
    commentresult = dbcursor.fetchall()
    allresult = {
        'product': productresult,
        'catagories': catagoriesresult,
        'like': likeresult,
        'dislike': dislikeresult,
        'comment': commentresult
    }
    return jsonify(allresult)

@app.route('/comment', methods=['POST'])
def comment():
    data = request.get_json()
    # print(data)
    sql = "INSERT INTO comment (Conent, Buyer_id, Buyer_name, Product_id) VALUES (%s, %s, %s, %s)"
    val = (data['Conent'], data['Buyer_id'], data['Buyer_name'], data['Product_id'])
    dbcursor.execute(sql, val)
    db.commit()

    sql = "SELECT * FROM `comment`"
    dbcursor.execute(sql)
    commentresult = dbcursor.fetchall()

    commentnum = 0
    
    for i in commentresult:
        if int(i[5]) == int(data['Product_id']):
            commentnum = commentnum + 1
    
    sql = "UPDATE products SET Comment_Sum = %s WHERE Product_id = %s"
    val = (commentnum, data['Product_id'])
    dbcursor.execute(sql, val)
    db.commit()

    return jsonify({'success': True, 'message': 'Comment posted successfully'})

@app.route('/like', methods=['POST'])
def like():
    data = request.get_json()
    if data['likeflag'] == 0:
        sql = "INSERT INTO `like` (`Product_id`, `Buyer_id`) VALUES (%s, %s)"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()
    if data['likeflag'] == 1:
        sql = "DELETE FROM `like` WHERE `Product_id` = %s AND `Buyer_id` = %s"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()
    if data['dislikeflag'] == 1:
        sql = "DELETE FROM `dislike` WHERE `Product_id` = %s AND `Buyer_id` = %s"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()

    sql = "SELECT * FROM `like` WHERE `Product_id` = %s"
    val = (data['Product_id'],)
    dbcursor.execute(sql, val)
    likeresult = dbcursor.fetchall()
    sql = "SELECT * FROM `dislike` WHERE `Product_id` = %s"
    val = (data['Product_id'],)
    dbcursor.execute(sql, val)
    dislikeresult = dbcursor.fetchall()
    sql = "UPDATE products SET Like_Sum = %s, Dislike_Sum = %s WHERE Product_id = %s"
    val = (str(len(likeresult)), str(len(dislikeresult)), data['Product_id'])
    dbcursor.execute(sql, val)
    db.commit()
    
    return jsonify({'success': True})

@app.route('/dislike', methods=['POST'])
def dislike():
    data = request.get_json()
    if data['dislikeflag'] == 0:
        sql = "INSERT INTO `dislike` (`Product_id`, `Buyer_id`) VALUES (%s, %s)"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()
    if data['dislikeflag'] == 1:
        sql = "DELETE FROM `dislike` WHERE `Product_id` = %s AND `Buyer_id` = %s"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()
    if data['likeflag'] == 1:
        sql = "DELETE FROM `like` WHERE `Product_id` = %s AND `Buyer_id` = %s"
        val = (data['Product_id'], data['userid'])
        dbcursor.execute(sql, val)
        db.commit()

    sql = "SELECT * FROM `like` WHERE `Product_id` = %s"
    val = (data['Product_id'],)
    dbcursor.execute(sql, val)
    likeresult = dbcursor.fetchall()
    sql = "SELECT * FROM `dislike` WHERE `Product_id` = %s"
    val = (data['Product_id'],)
    dbcursor.execute(sql, val)
    dislikeresult = dbcursor.fetchall()
    sql = "UPDATE products SET Like_Sum = %s, Dislike_Sum = %s WHERE Product_id = %s"
    val = (str(len(likeresult)), str(len(dislikeresult)), data['Product_id'])
    dbcursor.execute(sql, val)
    db.commit()
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
