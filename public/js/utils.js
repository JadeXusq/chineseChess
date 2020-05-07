/**
 * @infor 通用工具类
 * @path  ./js/utils.js
 * @user  xsq
 * @date  2020-04-28 11:26:49
 */

/**
 * 获取地址栏参数
 * @param  {string} name 参数名称
 * @return {string}      返回参数值
 */
function getQueryString(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");   
  var r = window.location.search.substr(1).match(reg);   
  if (r != null) return decodeURI(r[2]); return null; 
}

/**
 * 提示框
 * @param  {string}   msg      消息
 * @param  {Function} callback 回调方法
 * @return void
 */
function tipMsg(msg,callback){
	$('#iosDialog').fadeIn(200);
	$("#iosDialog .weui-dialog__bd").html(msg);
	$("#iosDialog .weui-dialog__btn").click(function(){
		if(!callback)
			$('#iosDialog').fadeOut(200);
		callback();
	})
}