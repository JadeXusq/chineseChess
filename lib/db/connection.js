/**
 * @infor 数据库连接文件
 * @path  ./lib/db/connection.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

const mysql = require('mysql');
const connectMysql = (host, user, password, database) => {
	var connection = mysql.createConnection({
	  host: host,
	  user: user,
	  password: password,
	  database: database,
	  // port: '3306'
	});
	return connection;
}

module.exports.connection = connectMysql;