/**
 * @infor 象棋后端主文件入口
 * @path  ./js/index.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

const { initApp } = require('./controller')
initApp();//初始化应用、路由

// 导入数据库查询方法
const { selectHandle, insertHandle, updateHandle } = require('./lib/db')

const { initEventHandle } = require('./controller/socketController')

let cons = [];//连接存放数组
let data = {};//存储初始化数据
let isConnect = false;//是否初次连接
let userList = [];
let CURRENT_COLOR = true;//初始化下棋方，true为红方

/**
 * 连接操作方法
 * @param  {Object} ws   websocket实例
 * @param  {Number} port 端口号
 * @return void
 */
const connectionHandle = (ws, port) => {
	cons.push({
		socket: ws,
		port: port
	});
	console.log("连接数:" + cons.length);
	isConnect && ws.send(JSON.stringify(data));
}

/**
 * 接收信息方法
 * @param  {string} message 消息json字符串
 * @return void
 */
const messageHandle = message => {
	isConnect = true;
	data = JSON.parse(message);
	data.type  == 'open' && (cons[cons.length - 1].username = data.currentUser);

	// 更新winner数据
	const updateWinnerNum = _ => {
		let updateSql = 'UPDATE rank SET num = num + 1 WHERE username = ?';
		let updateParams = [data.win];
		updateHandle(updateSql, updateParams);
	}

	// 插入用户数据
	const insertUserData = _ => {
		//设置用户表
		setUserInfo(userList, data.currentUser);
		data.isInit = true;

		//添加新用户，默认赢的次数为0
		const insertUserInfoData = index => {
			let sql = `select * from rank where username = '${userList[index].currentUser}'`;//查询语句必须带引号
			selectHandle(sql, result => {
				const insertUserAndSendInfo = _ => {
					let addSql = 'INSERT INTO rank(username,num) VALUES(?,?)';
					let addSqlParams = [userList[index].currentUser,0];
					insertHandle(addSql, addSqlParams, _ => {
						sendAllUserInfo(data);
					});
				}

				// 表里没有该用户的话，插入新用户
				result.length == 0 && insertUserAndSendInfo()
			});
		}

		userList.forEach((item, index) => insertUserInfoData(index))
	}

	data.win && updateWinnerNum() // 用户胜利，更新winner数据
	!data.currentUser ? (data.isInit = false) : insertUserData() //当前用户是否存在，存在查询更新数据
	sendAllUserInfo(data);//查询所有用户信息
}

/**
 * 关闭连接方法
 * @param  {Number} code   错误码
 * @param  {Object} reason 错误原因
 * @param  {Object} ws     websocket实例
 * @return void
 */
const closeHandle = (code, reason, ws) => {
	let popNum = -1;
	cons.forEach((con, index) => {
		con && con.socket == ws && (popNum = index)
	})

	const setUserList = index => {
		userList.splice(index, 1)
		data.userList = userList;
	}
	userList.forEach((item, index) => {
		cons[popNum].username == item.currentUser && setUserList(index)
	})

	cons.splice(popNum, 1)
	console.log("已断开webSocket连接,code:" + code + ",reason:" + reason);
	console.log(`当前连接数:${cons.length}`)
}

/**
 * 错误监听方法
 * @param  {Object} e 异常对象
 * @return void
 */
const errorHandle = e => console.error(e)

// 初始化事件方法
initEventHandle({
	connection: connectionHandle,
	message: messageHandle,
	close: closeHandle,
	error: errorHandle
})

/**
 * 发送所有用户数据，同步更新给所有用户数据
 * @return void
 */
function sendAllUserInfo(){
	data.userList = userList;

	// 移动操作，切换持方
	if (data.type == 'move')
		CURRENT_COLOR = !CURRENT_COLOR;
	data.currentColor = CURRENT_COLOR;

	// 查询数据库
	let sqlSelectAll = 'select * from rank';
	selectHandle(sqlSelectAll, (result) => {
		result && (data.rank = result);
		cons.forEach((item, index) => item.socket.send(JSON.stringify(data)))
	})
}

/**
 * 设置用户信息
 * @param {Array} arr  用户信息数组
 * @param {String} user 用户名
 */
function setUserInfo(arr, user){
	if (arr.length >= 2 || (arr.length == 1 && arr[0].currentUser == user)) {
		return
	}

	// 设置红方、黑方信息
	let isRed = false;
	arr.forEach(item => (item.isRed === 'red' && (isRed = true)))
	arr.push({
		currentUser: user,
		isRed: isRed ? 'black' : 'red'
	})
}