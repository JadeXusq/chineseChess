/**
 * @infor 初始化路由
 * @path  ./controller/index.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const path = require('path');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const chalk = require('chalk');//打印样式美化
const ip = require('ip')

// 初始化引用
const initApp = () => {
	//首页路由
	app.get("/",function(req,res){
		res.sendFile(path.join(__dirname, "../views/chess.html"));
	})

	//其他路由
	app.get("/:view",function(req,res){
		res.sendFile(path.join(__dirname, "../views/"+req.params.view+".html"));
	})

	//网站图标
	app.get("/favicon.ico",function(req,res){
		res.sendFile(path.join(__dirname, "../public/img/icon.png"));
	})

	//静态文件保存public文件夹
	app.use(express.static(path.join(__dirname, '../public')));

	// post请求
	app.post("/postFormData",urlencodedParser,function(req,res){
		res.send(req.body.value);
	})

	// 监听端口，控制台打印提示
	let port = 8882
	app.listen(port);
	console.log(`server is started by port ${port}`);
	console.log(` - Local:   ${chalk.green(`http://localhost:${port}/login`)}`)
	console.log(` - Network: ${chalk.green(`http://${ip.address()}:${port}/login`)}`)
}

module.exports = {
	initApp
}