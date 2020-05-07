/**
 * @infor websocket控制器
 * @path  ./controller/socketController.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

//创建websocket实例
const WebSocket = require("ws");

/**
 * 创建websocket服务器
 * @param  {Number} port 端口号
 * @return {Object}      websocket实例对象
 */
const createWebSocket = port => server = new WebSocket.Server({ port: port });

/**
 * 初始化websocket事件
 * @param  {Object} eventHandleObject  事件对象,对应事件操作方法,如{connection: connectionHandle, message: messageHandle, close: closeHandle, error: errorHandle}
 * @param  {Number} port               端口号
 * @return void
 */
const initEventHandle = (eventHandleObject, port = 3006) => {
	const server = createWebSocket(port)
	server.on('connection', ws => {
		Object.keys(eventHandleObject).forEach(event => {
			event === 'connection' 
			? eventHandleObject[event](ws, port) 
			: ws.on(event, function () { eventHandleObject[event](...arguments, ws) });//连接事件直接执行事件方法,其他事件在监听方法内执行
		})
	})
}

module.exports = {
	createWebSocket,
	initEventHandle
}