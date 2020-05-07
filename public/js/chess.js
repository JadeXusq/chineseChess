/**
 * @infor 象棋类
 * @path  ./js/chess.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

function chinaChess () {}
//初始化
chinaChess.prototype.init = function(){
	var canvas = document.getElementById("canvas");
	this.chessBoard = canvas.getContext("2d");
	this.radius = 23; //半径
	this.grid = 50;
	this.CandidateCircleR = 5;
	this.ws=new WebSocket("ws://localhost:3006");
	this.sendData=new Object();
	// this.sendData.turn='red';
	// this.sendData.currentUser=$("#username").html();
	$("curActive").text("红方");
	this.curActive = "red";
	this.initChessBoard();
	this.initChess();
	this.addEvent();
	this.sendMessage();
}
//发送数据
chinaChess.prototype.sendMessage=function(){
	var _this=this;

	//打开连接发送数据
	_this.ws.onopen=function(){
		var object={
			currentUser:$("#username").html(),
			type:'open'
		}
		_this.ws.send(JSON.stringify(object));
	}

	//接收信息
	_this.ws.onmessage=function(msg){
		_this.sendData=JSON.parse(msg.data);
		switch(_this.sendData.currentColor){
			case true:
				_this.curActive='red';
				$(".currentTeam span").html("红");
				$(".currentTeam span").css("color","red");
				break;
			case false:
				_this.curActive='black';
				$(".currentTeam span").html("黑");
				$(".currentTeam span").css("color","black");
				break;
		}
		if(_this.sendData.isInit){
			//设置对战双方用户信息
			var arr=_this.sendData.userList;
			for(var i=0;i<arr.length;i++){
				if(arr[i].isRed=='red'){
					$(".redTeam").html(arr[i].currentUser);
					if(arr[i].currentUser==$("#username").html()){
						$(".userPanel span").eq(0).html("<span style='color:red;'>红方：</span>");
					}
				}
				else{
					$(".blackTeam").html(arr[i].currentUser);
					if(arr[i].currentUser==$("#username").html()){
						$(".userPanel span").eq(0).html("<span style='color:black;'>黑方：</span>");
					}
				}
			}
		}else{
			//更新下棋信息
			_this.cheer_arr_ALL=_this.sendData.cheer_arr_ALL;
			_this.sendData.cheer_arr_ALL=_this.cheer_arr_ALL;
			_this.preChess=_this.sendData.preChess;
			_this.updateChess();
			if(_this.sendData.win&&_this.sendData!=""){
				tipMsg(_this.sendData.win+"赢了");
				_this.sendData.win=null;
				_this.gameOver();
			}
			// _this.checked = false;
		}
		_this.sendData.win=null;
		var rank=_this.sendData.rank;
		_this.setRank(rank);
	}
}
//排行榜设置
chinaChess.prototype.setRank=function(rank){
	$("#rank").html("");
	if(!rank||rank.length==0)
		return;
	var html='';
	html+='<tr>';
	html+='	<th>序号</th>';
	html+='	<th>用户名</th>';
	html+='	<th>获胜次数</th>';
	html+='</tr>';
	for(var i=0;i<rank.length;i++){
		rank[i].num=parseInt(rank[i].num);
	}
	rank.sort(function(a,b){
		return b.num-a.num;
	})
	for(var i=0;i<rank.length;i++){
		html+='<tr>';
		html+='  <td>'+(i+1)+'</td>';
		html+='  <td>'+rank[i].username+'</td>';
		html+='  <td>'+rank[i].num+'</td>'
		html+='</tr>';
	}
	$("#rank").append(html);
}
//初始化棋盘
chinaChess.prototype.initChessBoard = function(){
	this.drawRowLine();
	this.drawColLine();
	this.chessBoard.clearRect(this.grid + 1, this.grid * 5 + 1, this.grid * 8 - 2, this.grid - 2);
	this.drawX();
	this.drawText();
	this.drawCurve();
}
//初始化棋子
chinaChess.prototype.initChess = function(){
	var Car_b1 = {
		x: 1,
		y: 1,
		text: "車"
	}
	var Horse_b1 = {
		x: 2,
		y: 1,
		text: "馬"
	}
	var Elephant_b1 = {
		x: 3,
		y: 1,
		text: "象"
	}
	var Scholar_b1 = {
		x: 4,
		y: 1,
		text: "士"
	}
	var Boss_b = {
		x: 5,
		y: 1,
		text: "将"
	}
	var Scholar_b2 = {
		x: 6,
		y: 1,
		text: "士"
	}
	var Elephant_b2 = {
		x: 7,
		y: 1,
		text: "象"
	}
	var Horse_b2 = {
		x: 8,
		y: 1,
		text: "馬"
	}
	var Car_b2 = {
		x: 9,
		y: 1,
		text: "車"
	}
	var Cannon_b1 = {
		x: 2,
		y: 3,
		text: "炮"
	}
	var Cannon_b2 = {
		x: 8,
		y: 3,
		text: "炮"
	}
	var Soldier_b1 = {
		x: 1,
		y: 4,
		text: "卒"
	}
	var Soldier_b2 = {
		x: 3,
		y: 4,
		text: "卒"
	}
	var Soldier_b3 = {
		x: 5,
		y: 4,
		text: "卒"
	}
	var Soldier_b4 = {
		x: 7,
		y: 4,
		text: "卒"
	}
	var Soldier_b5 = {
		x: 9,
		y: 4,
		text: "卒"
	}
	var Car_r1 = {
		x: 1,
		y: 10,
		text: "車"
	}
	var Horse_r1 = {
		x: 2,
		y: 10,
		text: "馬"
	}
	var Elephant_r1 = {
		x: 3,
		y: 10,
		text: "相"
	}
	var Scholar_r1 = {
		x: 4,
		y: 10,
		text: "仕"
	}
	var Boss_r = {
		x: 5,
		y: 10,
		text: "帅"
	}
	var Scholar_r2 = {
		x: 6,
		y: 10,
		text: "仕"
	}
	var Elephant_r2 = {
		x: 7,
		y: 10,
		text: "相"
	}
	var Horse_r2 = {
		x: 8,
		y: 10,
		text: "馬"
	}
	var Car_r2 = {
		x: 9,
		y: 10,
		text: "車"
	}
	var Cannon_r1 = {
		x: 2,
		y: 8,
		text: "炮"
	}
	var Cannon_r2 = {
		x: 8,
		y: 8,
		text: "炮"
	}
	var Soldier_r1 = {
		x: 1,
		y: 7,
		text: "兵"
	}
	var Soldier_r2 = {
		x: 3,
		y: 7,
		text: "兵"
	}
	var Soldier_r3 = {
		x: 5,
		y: 7,
		text: "兵"
	}
	var Soldier_r4 = {
		x: 7,
		y: 7,
		text: "兵"
	}
	var Soldier_r5 = {
		x: 9,
		y: 7,
		text: "兵"
	}
	this.cheer_arr_B = [Car_b1, Horse_b1, Elephant_b1, Scholar_b1, Boss_b, Scholar_b2, Elephant_b2, Horse_b2, Car_b2,
		Cannon_b1, Cannon_b2, Soldier_b1, Soldier_b2, Soldier_b3, Soldier_b4, Soldier_b5
	];
	this.cheer_arr_R = [Car_r1, Horse_r1, Elephant_r1, Scholar_r1, Boss_r, Scholar_r2, Elephant_r2, Horse_r2, Car_r2,
		Cannon_r1, Cannon_r2, Soldier_r1, Soldier_r2, Soldier_r3, Soldier_r4, Soldier_r5
	];
	this.drawChess('#000','#f00');
}
chinaChess.prototype.drawChess=function(color1,color2){
	var _this = this;
	$.each(this.cheer_arr_B, function(i, e) {
		e.color = color1;
		e.bgcolor = "#fff";
		e.bgColor_b = color1;
		e.type = "black";
		_this.drawPiece(e);
		_this.drawChessText(e);
	});
	$.each(this.cheer_arr_R, function(i, e) {
		e.color = color2;
		e.bgcolor = "#fff";
		e.bgColor_b = color2;
		e.type = "red";
		_this.drawPiece(e);
		_this.drawChessText(e);
	});
	this.cheer_arr_ALL = this.cheer_arr_B.concat(this.cheer_arr_R);
}
//画直线
chinaChess.prototype.drawLine = function(x0, y0, x1, y1, lw){
	var x0 = x0 * this.grid;
	var y0 = y0 * this.grid;
	var x1 = x1 * this.grid;
	var y1 = y1 * this.grid;
	this.chessBoard.beginPath();
	this.chessBoard.strokeStyle = "#000";
	this.chessBoard.lineWidth = lw ? lw : 1;
	this.chessBoard.moveTo(x0, y0);
	this.chessBoard.lineTo(x1, y1);
	this.chessBoard.stroke();
	this.chessBoard.closePath();
}
//画横线
chinaChess.prototype.drawRowLine = function(){
	for(var i = 1; i <= 10; i++) {
		this.drawLine(1, i, 9, i);
	}
}
//画竖线
chinaChess.prototype.drawColLine = function(){
	for(var i = 1; i <= 9; i++) {
		this.drawLine(i, 1, i, 10);
	}
}
//画X
chinaChess.prototype.drawX = function(){
	this.drawLine(4, 1, 6, 3, 0.5);
	this.drawLine(4, 3, 6, 1, 0.5);
	this.drawLine(4, 8, 6, 10, 0.5);
	this.drawLine(4, 10, 6, 8, 0.5);
}
//画#
chinaChess.prototype.drawCurve = function(){
	
}
//楚河汉界
chinaChess.prototype.drawText = function(){
	this.chessBoard.font = "bold 30px Courier New";
	this.chessBoard.fillStyle = "#000";
	this.chessBoard.fillText("楚 河", this.grid * 2, this.grid * 5 + this.grid / 2 + 10);
	this.chessBoard.fillText("漢 界", this.grid * 6, this.grid * 5 + this.grid / 2 + 10);
	this.chessBoard.font = "12px Courier New";
	this.text_arr = ["九", "八", "七", "六", "五", "四", "三", "二", "一"];
	for(var i = 0; i <	9; i++) {
		this.chessBoard.fillText((i + 1).toString(), this.grid * (i + 1) - 5, 20);
		this.chessBoard.fillText(this.text_arr[i], this.grid * (i + 1) - 5, this.grid * 10 + 30 +　10);
	}
}
//棋子形状
chinaChess.prototype.drawPiece = function(e){
	this.chessBoard.beginPath();
	this.chessBoard.fillStyle = e.bgcolor;
	this.chessBoard.strokeStyle = e.bgColor_b;
	this.chessBoard.lineWidth = 2;
	this.chessBoard.arc(e.x * this.grid, e.y * this.grid, this.radius, 0, Math.PI * 2, true);
	this.chessBoard.closePath();
	this.chessBoard.fill();
	this.chessBoard.stroke();
}
//棋子文字
chinaChess.prototype.drawChessText = function(e){
	this.chessBoard.font = "bold 30px Courier New";
	this.chessBoard.fillStyle = e.color;
	var offset = this.chessBoard.measureText(e.text).width / 2;
	this.chessBoard.fillText(e.text, e.x * this.grid - offset, e.y * this.grid + 10);
}
//增加点击事件
chinaChess.prototype.addEvent = function(){
	var _this = this;
	this.checked = false;
	$("canvas").mousedown(function(ev){
		var currentUser=$("#username").html();
		var redUser=$(".redTeam").html();
		var blackUser=$(".blackTeam").html();
		if(redUser==''||blackUser==''){
			tipMsg("请等待玩家进入游戏")//玩家人数不足
		}else{
			var canMove=false;
			if(currentUser==redUser||currentUser==blackUser){
				//判断当前可否移动棋子
				if((currentUser==redUser&&_this.sendData.currentColor)||(currentUser==blackUser&&!_this.sendData.currentColor))
					canMove=true;
			}
			else{
				tipMsg("您没有权限移动棋子，您可以选择观战或者新开一局游戏。");//游客观战
				return;
			}
			//可移动执行操作
			if(canMove){
				for(var j = 1; j <= 10; j++){
					for(var i = 1; i <= 9; i++){
					    var  temp_i = i * _this.grid;
					    var  temp_j = j * _this.grid;
					    var distanct = Math.sqrt(Math.pow(temp_i - ev.offsetX, 2) + Math.pow(temp_j - ev.offsetY, 2));
					    if(distanct <= _this.radius){
					    	var overChess = false;
					    	$.each(_this.cheer_arr_ALL, function(ii, ee) {
								if(ee.x == i && ee.y == j) {
									overChess = true;
									console.log(ee)
									if(_this.curActive != ee.type && ! _this.checked) {
										return false;
									}
									if(!_this.checked) {
										_this.preChess = ee;
										_this.initAllChessColor(_this.cheer_arr_ALL);
										ee.bgcolor="yellow";
										_this.drawPiece(ee);
										_this.drawChessText(ee);
										_this.drawCurrentChess();
										_this.checked = true;
									}
									else if(_this.preChess.x == ee.x && _this.preChess.y == ee.y) {
										//      console.log("点在原棋子上");
										_this.updateChess();
										_this.checked = false;
									} else if(_this.preChess.type == ee.type) {
										//      console.log("切换棋子");
										_this.updateChess();
										_this.preChess = ee;
										_this.initAllChessColor(_this.cheer_arr_ALL);
										ee.bgcolor="yellow";
										_this.drawPiece(ee);
										_this.drawChessText(ee);
										_this.drawCurrentChess();
									}
									else {
										// 是否能吃子
										if(_this.eat_rule(i, j)) {
											_this.eat(ii, ee, i, j);
										}  
									}
									return false;
								}
							});
							if(overChess == true) {
							} else {
								if(_this.checked == true && _this.move_ruler(i, j)) { 
									_this.move(i, j);
								}
							}
					    }
					}
				}
			}else{
				switch(_this.sendData.currentColor){
					case true:
						tipMsg("请等待红方下棋");
						break;
					case false:
						tipMsg("请等待黑方下棋");
						break;
				}
			}
		}
	});
}
//棋子颜色初始化
chinaChess.prototype.initAllChessColor=function(arr){
	var _this=this;
	_this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
	_this.initChessBoard();
	$.each(arr,function(i,e){
		e.bgcolor="#fff";
		_this.drawPiece(e);
		_this.drawChessText(e);
	})
}
//棋子移动
chinaChess.prototype.move = function(i, j){
	var _this = this;
	var currentUser=$("#username").html();
	var redUser=$(".redTeam").html();
	var blackUser=$(".blackTeam").html();
	$.each(_this.cheer_arr_ALL, function(iii, eee){
		if(eee.x == _this.preChess.x && eee.y == _this.preChess.y) {
			//_this.note(eee, i, j);
			eee.x = i;
			eee.y = j;
			_this.curActive = eee.type == "red" ? "black" : "red";
			return false;
		}
	});
	this.sendData.cheer_arr_ALL=_this.cheer_arr_ALL;
	this.sendData.currentUser=null;
	if(currentUser==redUser||currentUser==blackUser){
		this.sendData.type="move";
		this.sendData.preChess=this.preChess;
		this.ws.send(JSON.stringify(_this.sendData));
	}
	else
		tipMsg("您没有权限移动棋子，您可以选择观战或者新开一局游戏。");
	// _this.updateChess();
	_this.checked = false;
}
//吃子
chinaChess.prototype.eat = function(ii, ee, i, j) {
	this.cheer_arr_ALL.splice(ii, 1);
	this.move(i, j);
	var _this=this;
	if(_this.isOver(ee)) {
		_this.gameOver();
	};
}
//
chinaChess.prototype.gameOver = function(){
	var _this=this;
	_this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
	_this.cheer_arr_ALL=new Array();
	_this.initChess();
	_this.sendData.type="move";
	_this.cheer_arr_ALL = _this.cheer_arr_B.concat(_this.cheer_arr_R);
	_this.sendData.cheer_arr_ALL=_this.cheer_arr_ALL;
	// console.log(_this.cheer_arr_ALL)
	// console.log(_this.sendData)
	_this.sendData.win=null;
	_this.ws.send(JSON.stringify(_this.sendData));
	_this.updateChess();
	return false;
}
// 是否结束
chinaChess.prototype.isOver = function(ee) {
	if(ee.text == "将") {
		// console.log($(".redTeam").html())
		this.sendData.win=$(".redTeam").html();
		this.ws.send(JSON.stringify(this.sendData));
		// tipMsg("红方胜利！");
		return true;
	} else if(ee.text == "帅") {
		this.sendData.win = $(".blackTeam").html();
		this.ws.send(JSON.stringify(this.sendData));
		tipMsg("黑方胜利!");
		return true;
	} else {
		return false;
	}
}
//棋子更新
chinaChess.prototype.updateChess = function(){
	this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
	this.initChessBoard();
	var _this = this;
	$.each(this.cheer_arr_ALL, function(i, e) {
		e.bgcolor="#fff";
		if(_this.preChess&&e.x==_this.preChess.x&&e.y==_this.preChess.y)
			e.bgcolor="yellow";
		_this.drawPiece(e);
		_this.drawChessText(e);
	});
	this.drawCurrentChess();
}
//当前选中边框
chinaChess.prototype.drawCurrentChess=function(){
	var _this=this;
	_this.chessBoard.beginPath();
	_this.chessBoard.strokeStyle = _this.preChess.bgColor_b;
	_this.chessBoard.lineWidth = 1;
	var left=_this.preChess.x*_this.grid-_this.grid/2;
	var top=_this.preChess.y*_this.grid-_this.grid/2;
	var right=_this.preChess.x*_this.grid+_this.grid/2;
	var bottom=_this.preChess.y*_this.grid+_this.grid/2;
	//左上
	_this.chessBoard.moveTo(left, top+7);
	_this.chessBoard.lineTo(left, top);
	_this.chessBoard.lineTo(left+7, top);
	//右上
	_this.chessBoard.moveTo(right, top+7);
	_this.chessBoard.lineTo(right, top);
	_this.chessBoard.lineTo(right-7, top);
	//左下
	_this.chessBoard.moveTo(left, bottom-7);
	_this.chessBoard.lineTo(left, bottom);
	_this.chessBoard.lineTo(left+7, bottom);
	//右下
	_this.chessBoard.moveTo(right, bottom-7);
	_this.chessBoard.lineTo(right, bottom);
	_this.chessBoard.lineTo(right-7, bottom);

	_this.chessBoard.stroke();
	_this.chessBoard.closePath();
}
//棋子的规则
chinaChess.prototype.move_ruler = function(i, j){
	switch(this.preChess.text){
		case "車":
		   return this.rule_car(i, j);
		case "馬":
		   return this.rule_horse(i, j);
		case "相":
		   return this.rule_elephant_r(i, j);
		case "象":
	       return this.rule_elephant_b(i, j);
		case "仕":
		   return this.rule_scholar_r(i, j);
		case "士":
		   return this.rule_scholar_b(i, j);
		case "帅":
		   return this.rule_king_r(i,j);
		case "将":
		   return this.rule_king_b(i, j);
		case "兵":
		   return this.rule_soldier_r(i, j);
		case "卒":
		   return this.rule_soldier_b(i, j);
		case "炮":
		   if(this.rule_cannon(i, j) == 0) {
				return true;
			}
			return false;
	
	}
}
// 棋子吃子规则
chinaChess.prototype.eat_rule = function(i, j) {
	switch(this.preChess.text) {
		case "車":
			return this.rule_car(i, j);
		case "馬":
			return this.rule_horse(i, j);
		case "相":
			return this.rule_elephant_r(i, j);
		case "象":
			return this.rule_elephant_b(i, j);
		case "仕":
			return this.rule_scholar_r(i, j);
		case "士":
			return this.rule_scholar_b(i, j);
		case "帅":
			return this.rule_king_r(i, j);
		case "将":
			return this.rule_king_b(i, j);
		case "兵":
			return this.rule_soldier_r(i, j);
		case "卒":
			return this.rule_soldier_b(i, j);
		case "炮":
			if(this.rule_cannon(i, j) == 1) {
				return true;
			}
			return false;
	}
}
//车的规则
chinaChess.prototype.rule_car = function(i, j){
	  if(this.preChess.x == i || this.preChess.y == j) {
		if(this.preChess.x == i) {
			if(this.preChess.y < j) {
				//    console.log("下");
				var hasObstacle = false;
				for(var p = this.preChess.y + 1; p < j; p++) {
					if(this.isObstacle(i, p)) {
						hasObstacle = true;
						break;
					}
				}
				if(hasObstacle) {
					return false;
				}
			}
			if(this.preChess.y > j) {
				//    console.log("上");
				var hasObstacle = false;
				for(var p = this.preChess.y - 1; p > j; p--) {
					if(this.isObstacle(i, p)) {
						hasObstacle = true;
						break;
					}
				}
				if(hasObstacle) {
					return false;
				}
			}
		}
		if(this.preChess.y == j) {
			if(this.preChess.x < i) {
				//    console.log("右");
				var hasObstacle = false;
				for(var p = this.preChess.x + 1; p < i; p++) {
					if(this.isObstacle(p, j)) {
						hasObstacle = true;
						break;
					}
				}
				if(hasObstacle) {
					return false;
				}
			}
			if(this.preChess.x > i) {
				//    console.log("左");
				var hasObstacle = false;
				for(var p = this.preChess.x - 1; p > i; p--) {
					if(this.isObstacle(p, j)) {
						hasObstacle = true;
						break;
					}
				}
				if(hasObstacle) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}
//马的规则
chinaChess.prototype.rule_horse = function(i, j){
	var hasObstacle = false;
	var _this = this;
	if((Math.abs(this.preChess.x - i) == 1 && Math.abs(this.preChess.y - j) == 2) ||
		(Math.abs(this.preChess.x - i) == 2 && Math.abs(this.preChess.y - j) == 1)) {
		return true;
	}
	return false;
}
//红相的规则
chinaChess.prototype.rule_elephant_r = function(i, j){
   var hasObstacle = false;
	var _this = this;
	if((Math.abs(_this.preChess.x - i) == 2 && Math.abs(_this.preChess.y - j) == 2) && j >= 6) {
		var tempX = (_this.preChess.x + i) / 2;
		var tempY = (_this.preChess.y + j) / 2;
	
		$.each(_this.cheer_arr_ALL, function(ii, ee) {
			if(ee.x == tempX && ee.y == tempY) {
				hasObstacle = true;
				return false;
			}
		});
		if(hasObstacle) {
			return false;
		}
		return true;
	}
	return false;
}
//黑象的规则
chinaChess.prototype.rule_elephant_b = function(i, j){
	var hasObstacle = false;
	var _this = this;
	if((Math.abs(_this.preChess.x - i) == 2 && Math.abs(_this.preChess.y - j) == 2) && j < 6) {
		var tempX = (_this.preChess.x + i) / 2;
		var tempY = (_this.preChess.y + j) / 2;
	
		$.each(_this.cheer_arr_ALL, function(ii, ee) {
			if(ee.x == tempX && ee.y == tempY) {
				hasObstacle = true;
				return false;
			}
		});
		if(hasObstacle) {
			return false;
		}
		return true;
	}
	return false;
}
//红仕的规则
chinaChess.prototype.rule_scholar_r = function(i, j){
	if(this.preChess.x == 5 && this.preChess.y == 9) {
		if(Math.abs(this.preChess.x - i) == 1 && Math.abs(this.preChess.y - j) == 1) {
			return true;
		}
	}else if(i == 5 && j == 9) {
		return true;
	}
	return false;
}
//黑士的规则
chinaChess.prototype.rule_scholar_b = function(i, j){
	if(this.preChess.x == 5 && this.preChess.y == 2) {
		if(Math.abs(this.preChess.x - i) == 1 && Math.abs(this.preChess.y - j) == 1) {
			return true;
		}
	} else if(i == 5 && j == 2) {
		return true;
	}
	return false;
}
//帅的规则
chinaChess.prototype.rule_king_r = function(i, j){
	if((Math.abs(this.preChess.x - i) == 1 && this.preChess.y == j) ||
		(this.preChess.x == i && Math.abs(this.preChess.y - j) == 1)) {
		if(i >= 4 && i <= 6 && j >= 8 && j <= 10) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}
//将的规则
chinaChess.prototype.rule_king_b = function(i, j){
	if((Math.abs(this.preChess.x - i) == 1 && this.preChess.y == j) ||
		(this.preChess.x == i && Math.abs(this.preChess.y - j) == 1)) {
		if(i >= 4 && i <= 6 && j >= 1 && j <= 3) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}
//兵的规则
chinaChess.prototype.rule_soldier_r = function(i, j){
   if(this.preChess.y <= 5) {
		if((this.preChess.x == i && this.preChess.y - 1 == j) || (this.preChess.x - 1 == i && this.preChess.y == j) || (this.preChess.x + 1 == i && this.preChess.y == j)) {
			return true;
		}
	} else {
		if(this.preChess.x == i && this.preChess.y - 1 == j) {
			return true;
		}
	}
	return false;
}
//卒的规则
chinaChess.prototype.rule_soldier_b = function(i, j){
	if(this.preChess.y > 5) {
		if((this.preChess.x == i && this.preChess.y + 1 == j) || (this.preChess.x - 1 == i && this.preChess.y == j) || (this.preChess.x + 1 == i && this.preChess.y == j)) {
			return true;
		}
	} else {
		if(this.preChess.x == i && this.preChess.y + 1 == j) {
			return true;
		}
	}
	return false;
}
//炮的规则
chinaChess.prototype.rule_cannon = function(i, j){
	var _this = this;
	if(this.preChess.x == i || this.preChess.y == j) {
		var t = 0;
		if(this.preChess.x == i) {
			var temp = this.preChess.y;
			if(temp < j) {
				while(++temp != j) {
					$.each(this.cheer_arr_ALL, function(ii, ee) {
						if(ee.x == _this.preChess.x && ee.y == temp) {
							t++;
							return false;
						}
					});
				}
				return t;
			} else {
				while(--temp != j) {
					$.each(this.cheer_arr_ALL, function(ii, ee) {
						if(ee.x == _this.preChess.x && ee.y == temp) {
							t++;
							return false;
						}
					});
				}
				return t;
			}
		} else {
			var temp = this.preChess.x;
			if(temp < i) {
				while(++temp != i) {
					$.each(this.cheer_arr_ALL, function(ii, ee) {
						if(ee.x == temp && ee.y == _this.preChess.y) {
							t++;
							return false;
						}
					});
				}
				return t;
			} else {
				while(--temp != i) {
					$.each(this.cheer_arr_ALL, function(ii, ee) {
						if(ee.x == temp && ee.y == _this.preChess.y) {
							t++;
							return false;
						}
					});
				}
				return t;
			}
		}
	}
	return 2;
}
//判断障碍物
chinaChess.prototype.isObstacle = function(x, y) {
	var hasObstacle = false;
	$.each(this.cheer_arr_ALL, function(ii, ee) {
		if(ee.x == x && ee.y == y) {
			hasObstacle = true;
			return false;
		}
	});
	return hasObstacle;
}