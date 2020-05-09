/**
 * @infor 象棋类
 * @path  ./js/chess.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

class ChinaChess {
	#sendData = {};//发送的数据
	#curActive = 'red';//当前持方
	
	constructor (radius = 23, grid = 50, ws = 'ws://localhost:3006') {
		this.radius = radius;//旗子半径
		this.grid = grid;//网格半径
		this.ws = new WebSocket(ws);//websocket实例
		let canvas = document.getElementById("canvas");
		this.chessBoard = canvas.getContext("2d");
		this.initChessBoard();//初始化棋盘
		this.initChess();//初始化棋子
		this.addEvent();//添加事件
		this.sendMessage();//发送、接收数据
	}

	// 初始化棋盘
	initChessBoard () {
		this.drawRowLine();
		this.drawColLine();
		this.chessBoard.clearRect(this.grid + 1, this.grid * 5 + 1, this.grid * 8 - 2, this.grid - 2);
	}

	// 绘制棋盘线
	drawLine (x0, y0, x1, y1, lw) {
		x0 = x0 * this.grid;
		y0 = y0 * this.grid;
		x1 = x1 * this.grid;
		y1 = y1 * this.grid;
		this.chessBoard.beginPath();
		this.chessBoard.strokeStyle = "#000";
		this.chessBoard.lineWidth = lw ? lw : 1;
		this.chessBoard.moveTo(x0, y0);
		this.chessBoard.lineTo(x1, y1);
		this.chessBoard.stroke();
		this.chessBoard.closePath();
	}

	// 绘制棋盘竖线
	drawRowLine () {
		for(let i = 1; i <= 10; i++) {
			this.drawLine(1, i, 9, i);
		}
	}

	// 绘制棋盘横线
	drawColLine () {
		for(let i = 1; i <= 9; i++) {
			this.drawLine(i, 1, i, 10);
		}
	}

	// 绘制棋子并初始化
	initChess () {
		let Car_b1 = {
			x: 1,
			y: 1,
			text: "車"
		}
		let Horse_b1 = {
			x: 2,
			y: 1,
			text: "馬"
		}
		let Elephant_b1 = {
			x: 3,
			y: 1,
			text: "象"
		}
		let Scholar_b1 = {
			x: 4,
			y: 1,
			text: "士"
		}
		let Boss_b = {
			x: 5,
			y: 1,
			text: "将"
		}
		let Scholar_b2 = {
			x: 6,
			y: 1,
			text: "士"
		}
		let Elephant_b2 = {
			x: 7,
			y: 1,
			text: "象"
		}
		let Horse_b2 = {
			x: 8,
			y: 1,
			text: "馬"
		}
		let Car_b2 = {
			x: 9,
			y: 1,
			text: "車"
		}
		let Cannon_b1 = {
			x: 2,
			y: 3,
			text: "炮"
		}
		let Cannon_b2 = {
			x: 8,
			y: 3,
			text: "炮"
		}
		let Soldier_b1 = {
			x: 1,
			y: 4,
			text: "卒"
		}
		let Soldier_b2 = {
			x: 3,
			y: 4,
			text: "卒"
		}
		let Soldier_b3 = {
			x: 5,
			y: 4,
			text: "卒"
		}
		let Soldier_b4 = {
			x: 7,
			y: 4,
			text: "卒"
		}
		let Soldier_b5 = {
			x: 9,
			y: 4,
			text: "卒"
		}
		let Car_r1 = {
			x: 1,
			y: 10,
			text: "車"
		}
		let Horse_r1 = {
			x: 2,
			y: 10,
			text: "馬"
		}
		let Elephant_r1 = {
			x: 3,
			y: 10,
			text: "相"
		}
		let Scholar_r1 = {
			x: 4,
			y: 10,
			text: "仕"
		}
		let Boss_r = {
			x: 5,
			y: 10,
			text: "帅"
		}
		let Scholar_r2 = {
			x: 6,
			y: 10,
			text: "仕"
		}
		let Elephant_r2 = {
			x: 7,
			y: 10,
			text: "相"
		}
		let Horse_r2 = {
			x: 8,
			y: 10,
			text: "馬"
		}
		let Car_r2 = {
			x: 9,
			y: 10,
			text: "車"
		}
		let Cannon_r1 = {
			x: 2,
			y: 8,
			text: "炮"
		}
		let Cannon_r2 = {
			x: 8,
			y: 8,
			text: "炮"
		}
		let Soldier_r1 = {
			x: 1,
			y: 7,
			text: "兵"
		}
		let Soldier_r2 = {
			x: 3,
			y: 7,
			text: "兵"
		}
		let Soldier_r3 = {
			x: 5,
			y: 7,
			text: "兵"
		}
		let Soldier_r4 = {
			x: 7,
			y: 7,
			text: "兵"
		}
		let Soldier_r5 = {
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

	// 绘制棋子
	drawChess (color1, color2) {
		$.each(this.cheer_arr_B, (i, e) => {
			e.color = color1;
			e.bgcolor = "#fff";
			e.bgColor_b = color1;
			e.type = "black";
			this.drawPiece(e);
			this.drawChessText(e);
		});
		$.each(this.cheer_arr_R, (i, e) => {
			e.color = color2;
			e.bgcolor = "#fff";
			e.bgColor_b = color2;
			e.type = "red";
			this.drawPiece(e);
			this.drawChessText(e);
		});
		this.cheer_arr_ALL = this.cheer_arr_B.concat(this.cheer_arr_R);
	}

	//绘制棋子外框
	drawPiece (e) {
		this.chessBoard.beginPath();
		this.chessBoard.fillStyle = e.bgcolor;
		this.chessBoard.strokeStyle = e.bgColor_b;
		this.chessBoard.lineWidth = 2;
		this.chessBoard.arc(e.x * this.grid, e.y * this.grid, this.radius, 0, Math.PI * 2, true);
		this.chessBoard.closePath();
		this.chessBoard.fill();
		this.chessBoard.stroke();
	}

	// 绘制棋子文案
	drawChessText (e) {
		this.chessBoard.font = "bold 30px Courier New";
		this.chessBoard.fillStyle = e.color;
		let offset = this.chessBoard.measureText(e.text).width / 2;
		this.chessBoard.fillText(e.text, e.x * this.grid - offset, e.y * this.grid + 10);
	}

	// 监听鼠标点击事件
	addEvent () {
		this.checked = false;
		$("canvas").mousedown( ev => {
			let currentUser = $("#username").html();
			let redUser = $(".redTeam").html();
			let blackUser = $(".blackTeam").html();
			if (redUser == '' || blackUser == '') {
				tipMsg("请等待玩家进入游戏")//玩家人数不足
			} else {
				let canMove = false;
				if (currentUser == redUser || currentUser == blackUser ) {
					//判断当前可否移动棋子
					if ((currentUser == redUser && this.#sendData.currentColor) || (currentUser == blackUser && !this.#sendData.currentColor))
						canMove=true;
				}
				else {
					tipMsg("您没有权限移动棋子，您可以选择观战或者新开一局游戏。");//游客观战
					return;
				}
				//可移动执行操作
				if (canMove) {
					for(let j = 1; j <= 10; j++){
						for(let i = 1; i <= 9; i++) {
						    let  temp_i = i * this.grid;
						    let  temp_j = j * this.grid;
						    let distanct = Math.sqrt(Math.pow(temp_i - ev.offsetX, 2) + Math.pow(temp_j - ev.offsetY, 2));
						    if(distanct <= this.radius){
						    	let overChess = false;
						    	$.each(this.cheer_arr_ALL, (ii, ee) => {
									if(ee.x == i && ee.y == j) {
										overChess = true;
										if(this.#curActive != ee.type && ! this.checked) {
											return false;
										}
										if(!this.checked) {
											this.preChess = ee;
											this.initAllChessColor(this.cheer_arr_ALL);
											ee.bgcolor="yellow";
											this.drawPiece(ee);
											this.drawChessText(ee);
											this.drawCurrentChess();
											this.checked = true;
										}
										else if(this.preChess.x == ee.x && this.preChess.y == ee.y) {
											//      console.log("点在原棋子上");
											this.updateChess();
											this.checked = false;
										} else if(this.preChess.type == ee.type) {
											//      console.log("切换棋子");
											this.updateChess();
											this.preChess = ee;
											this.initAllChessColor(this.cheer_arr_ALL);
											ee.bgcolor="yellow";
											this.drawPiece(ee);
											this.drawChessText(ee);
											this.drawCurrentChess();
										}
										else {
											// 是否能吃子
											if(this.eat_rule(i, j)) {
												this.eat(ii, ee, i, j);
											}  
										}
										return false;
									}
								});
								if(overChess == true) {
								} else {
									if(this.checked == true && this.eat_rule(i, j, 'move')) { 
										this.move(i, j);
									}
								}
						    }
						}
					}
				}else{
					switch(this.#sendData.currentColor){
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

	// 初始化棋子颜色
	initAllChessColor (arr) {
		this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
		this.initChessBoard();
		$.each(arr, (i,e) => {
			e.bgcolor="#fff";
			this.drawPiece(e);
			this.drawChessText(e);
		})
	}

	//当前选中边框
	drawCurrentChess () {
		this.chessBoard.beginPath();
		this.chessBoard.strokeStyle = this.preChess.bgColor_b;
		this.chessBoard.lineWidth = 1;
		let left=this.preChess.x*this.grid-this.grid/2;
		let top=this.preChess.y*this.grid-this.grid/2;
		let right=this.preChess.x*this.grid+this.grid/2;
		let bottom=this.preChess.y*this.grid+this.grid/2;
		//左上
		this.chessBoard.moveTo(left, top+7);
		this.chessBoard.lineTo(left, top);
		this.chessBoard.lineTo(left+7, top);
		//右上
		this.chessBoard.moveTo(right, top+7);
		this.chessBoard.lineTo(right, top);
		this.chessBoard.lineTo(right-7, top);
		//左下
		this.chessBoard.moveTo(left, bottom-7);
		this.chessBoard.lineTo(left, bottom);
		this.chessBoard.lineTo(left+7, bottom);
		//右下
		this.chessBoard.moveTo(right, bottom-7);
		this.chessBoard.lineTo(right, bottom);
		this.chessBoard.lineTo(right-7, bottom);

		this.chessBoard.stroke();
		this.chessBoard.closePath();
	}

	// 吃子规则、移动规则
	eat_rule (i, j, type = 'eat') {
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
				if ((type = 'eat' && this.rule_cannon(i, j) == 1) || (type = 'move' && this.rule_cannon(i, j) == 0)) {
					return true;
				}
				return false;
		}
	}

	// 吃子
	eat (ii, ee, i, j) {
		this.cheer_arr_ALL.splice(ii, 1);
		this.move(i, j);
		if(this.isOver(ee)) {
			this.gameOver();
		};
	}

	// 车的规则
	rule_car (i, j) {
		if(this.preChess.x == i || this.preChess.y == j) {
			if(this.preChess.x == i) {
				if(this.preChess.y < j) {
					//    console.log("下");
					let hasObstacle = false;
					for(let p = this.preChess.y + 1; p < j; p++) {
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
					let hasObstacle = false;
					for(let p = this.preChess.y - 1; p > j; p--) {
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
					let hasObstacle = false;
					for(let p = this.preChess.x + 1; p < i; p++) {
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
					let hasObstacle = false;
					for(let p = this.preChess.x - 1; p > i; p--) {
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
	rule_horse (i, j) {
		let hasObstacle = false;
		if((Math.abs(this.preChess.x - i) == 1 && Math.abs(this.preChess.y - j) == 2) ||
			(Math.abs(this.preChess.x - i) == 2 && Math.abs(this.preChess.y - j) == 1)) {
			return true;
		}
		return false;
	}

	//红相的规则
	rule_elephant_r (i, j) {
	   let hasObstacle = false;
		if((Math.abs(this.preChess.x - i) == 2 && Math.abs(this.preChess.y - j) == 2) && j >= 6) {
			let tempX = (this.preChess.x + i) / 2;
			let tempY = (this.preChess.y + j) / 2;
		
			$.each(this.cheer_arr_ALL, (ii, ee) => {
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

	// 黑象的规则
	rule_elephant_b (i, j) {
		let hasObstacle = false;
		if((Math.abs(this.preChess.x - i) == 2 && Math.abs(this.preChess.y - j) == 2) && j < 6) {
			let tempX = (this.preChess.x + i) / 2;
			let tempY = (this.preChess.y + j) / 2;
		
			$.each(this.cheer_arr_ALL, (ii, ee) => {
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
	rule_scholar_r (i, j) {
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
	rule_scholar_b (i, j) {
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
	rule_king_r (i, j) {
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
	rule_king_b (i, j) {
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
	rule_soldier_r (i, j) {
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
	rule_soldier_b (i, j) {
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
	rule_cannon (i, j) {
		if(this.preChess.x == i || this.preChess.y == j) {
			let t = 0;
			if(this.preChess.x == i) {
				let temp = this.preChess.y;
				if(temp < j) {
					while(++temp != j) {
						$.each(this.cheer_arr_ALL, (ii, ee) => {
							if(ee.x == this.preChess.x && ee.y == temp) {
								t++;
								return false;
							}
						});
					}
					return t;
				} else {
					while(--temp != j) {
						$.each(this.cheer_arr_ALL, (ii, ee) => {
							if(ee.x == this.preChess.x && ee.y == temp) {
								t++;
								return false;
							}
						});
					}
					return t;
				}
			} else {
				let temp = this.preChess.x;
				if(temp < i) {
					while(++temp != i) {
						$.each(this.cheer_arr_ALL, (ii, ee) => {
							if(ee.x == temp && ee.y == this.preChess.y) {
								t++;
								return false;
							}
						});
					}
					return t;
				} else {
					while(--temp != i) {
						$.each(this.cheer_arr_ALL, (ii, ee) => {
							if(ee.x == temp && ee.y == this.preChess.y) {
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
	isObstacle (x, y) {
		let hasObstacle = false;
		$.each(this.cheer_arr_ALL, (ii, ee) => {
			if(ee.x == x && ee.y == y) {
				hasObstacle = true;
				return false;
			}
		});
		return hasObstacle;
	}

	//棋子移动
	move (i, j) {
		let currentUser = $("#username").html();
		let redUser = $(".redTeam").html();
		let blackUser = $(".blackTeam").html();
		$.each(this.cheer_arr_ALL, (iii, eee) => {
			if(eee.x == this.preChess.x && eee.y == this.preChess.y) {
				eee.x = i;
				eee.y = j;
				this.#curActive = eee.type == "red" ? "black" : "red";
				return false;
			}
		});
		this.#sendData.cheer_arr_ALL = this.cheer_arr_ALL;
		this.#sendData.currentUser = null;
		if (currentUser == redUser || currentUser == blackUser ) {
			this.#sendData.type="move";
			this.#sendData.preChess=this.preChess;
			this.ws.send(JSON.stringify(this.#sendData));
		} else {
			tipMsg("您没有权限移动棋子，您可以选择观战或者新开一局游戏。");
		}
		// this.updateChess();
		this.checked = false;
	}


	//发送数据
	sendMessage () {
		//打开连接发送数据
		this.ws.onopen = () => {
			let object = {
				currentUser: $("#username").html(),
				type: 'open'
			}
			this.ws.send(JSON.stringify(object));
		}

		// 设置颜色
		const setColor = type => {
			this.#curActive = type;
			$(".currentTeam span").html(type == 'red' ? '红' : '黑');
			$(".currentTeam span").css("color", type);
		}

		// 设置初始用户信息
		const setInitInfo = _ => {
			let arr = this.#sendData.userList;
			const setUserInfo = (type, item) => {
				$(type == 'red' ? '.redTeam' : '.blackTeam').html(item.currentUser);
				if (item.currentUser == $("#username").html()) {
					$(".userPanel span").eq(0).html("<span style='color:red;'>红方：</span>");
				}
			}
			arr.forEach(item => setUserInfo(item.isRed, item))
		}

		//更新下棋信息
		const updateChessInfo = _ => {
			this.cheer_arr_ALL = this.#sendData.cheer_arr_ALL;
			this.#sendData.cheer_arr_ALL = this.cheer_arr_ALL;
			this.preChess = this.#sendData.preChess;
			this.updateChess();
			if (this.#sendData.win && this.#sendData != "") {
				tipMsg(this.#sendData.win + "赢了");
				this.#sendData.win = null;
				this.gameOver();
			}
		}

		//接收信息
		this.ws.onmessage = (msg) => {
			this.#sendData = JSON.parse(msg.data);
			this.#sendData.currentColor ? setColor('red') : setColor('black')

			this.#sendData.isInit ? setInitInfo() : updateChessInfo()

			this.#sendData.win = null;
			let rank = this.#sendData.rank;
			this.setRank(rank);
		}
	}


	//棋子更新
	updateChess () {
		this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
		this.initChessBoard();
		$.each(this.cheer_arr_ALL, (i, e) => {
			e.bgcolor="#fff";
			if (this.preChess && e.x == this.preChess.x && e.y == this.preChess.y)
				e.bgcolor = "yellow";
			this.drawPiece(e);
			this.drawChessText(e);
		})
		this.drawCurrentChess();
	}

	//游戏结束
	gameOver () {
		this.chessBoard.clearRect(0, 0, canvas.width, canvas.height);
		this.cheer_arr_ALL = new Array();
		this.initChess();
		this.#sendData.type = "move";
		this.cheer_arr_ALL = this.cheer_arr_B.concat(this.cheer_arr_R);
		this.#sendData.cheer_arr_ALL = this.cheer_arr_ALL;
		this.#sendData.win = null;
		this.ws.send(JSON.stringify(this.#sendData));
		this.updateChess();
	}

	// 是否结束
	isOver (ee) {
		const winOperate = type => {
			this.#sendData.win = $(type == 'red' ? '.redTeam' : '.blackTeam').html();
			this.ws.send(JSON.stringify(this.#sendData));
			tipMsg(type == 'red' ? '红方胜利！' : '黑方胜利!');
			return true
		}
		return ee.text == "将" 
				? winOperate('red') : ee.text == "帅"
				? winOperate('black') : false
	}

	//排行榜设置
	setRank (rank) {
		if (!rank || rank.length == 0)
			return;
		$("#rank").html("");
		let html = '';
		html += '<tr>';
		html += '	<th>序号</th>';
		html += '	<th>用户名</th>';
		html += '	<th>获胜次数</th>';
		html += '</tr>';

		rank.forEach((item, index) => (item.num = parseInt(item.num)))
		rank.sort((a,b) => (b.num - a.num))

		rank.forEach((item, index) => {
			html += '<tr>';
			html += '  <td>' + (index + 1) + '</td>';
			html += '  <td>' + item.username + '</td>';
			html += '  <td>' + item.num + '</td>'
			html += '</tr>';
		})
		$("#rank").append(html);
	}
}