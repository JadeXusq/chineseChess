/**
 * @infor 数据库查询文件
 * @path  ./lib/db/index.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

// 连接数据库
const connectMysql = require('./connection');
const connection = connectMysql.connection('localhost', 'root', 'xsq123456', 'rank');
connection.connect();

/**
 * 查询用户
 * @param  {string}   sql      查询sql语句
 * @param  {Function} callback 回调方法
 * @return void
 */
const selectHandle = (sql,callback) => {
	connection.query(sql, (err, result) => {
		if (err) {
			console.log("[select error]--" + err.message);
			return;
		}
		callback && callback(result);
	})
}

/**
 * 插入用户
 * @param  {string}   addSql       插入sql语句
 * @param  {Array}   addSqlParams  传入参数数组
 * @param  {Function} callback     回调方法
 * @return void
 */
const insertHandle = (addSql, addSqlParams, callback) => {
	connection.query(addSql, addSqlParams, (err, result) => {
		if (err) {
			console.log("[insert error]--" + err.message);
			return;
		}
		callback && callback(result);
	})
}

/**
 * 更新用户
 * @param  {string}   updateSql       更新sql语句
 * @param  {Array}   updateParams  传入参数数组
 * @param  {Function} callback     回调方法
 * @return void
 */
const updateHandle = (updateSql, updateParams, callback) => {
	connection.query(updateSql, updateParams, (err, result) => {
		if (err) {
			console.log("[update error]--" + err.message);
			return;
		}
		callback && callback(result);
	})
}


module.exports = {
	selectHandle,
	insertHandle,
	updateHandle
}