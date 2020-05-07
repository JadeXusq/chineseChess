/**
 * @infor 象棋前端主文件入口
 * @path  ./js/index.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

$(document).ready( _ => {

	//获取地址栏参数
	$('#username').html(getQueryString('username'));
	//判断是否登陆
	if(!$('#username').html())
		window.location.href = '/login';

	// 初始化象棋
	let cChess = new chinaChess()
	cChess.init();

	//设置等待下棋
	wait();
})

/**
 * 等待中，简易动效
 * @return void
 */
function wait () {
	setInterval( _ => {
		var val = $('.currentTeam>i').html();
		switch (val) {
			case '.':
				$('.currentTeam>i').html('..');
				break;
			case '..':
				$('.currentTeam>i').html('...');
				break;
			case '...':
				$('.currentTeam>i').html('.');
				break;
		}
	}, 500);
}