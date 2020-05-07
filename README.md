# 中国象棋基于nodeJs+websocket对战版

## 项目简介
 - nodeJs+express+websocket+mysql+html5+css3+jquery
 - h5前端实现中国象棋对战逻辑，同时通过websocket发送接收实时对战数据，同步到各个客户端界面，显示对战详情及结果
 - nodeJs后端接收处理各个客户端发送的请求，通过增删改查sql命令来存储用户对战排行榜，同时将各个客户端对战数据同步到其他客户端，推进对战进程，控制持方及游客是否可对棋局进行相应操作
 - 前期先通过h5实现象棋对战过程，后期考虑新增小程序对战版

## 项目克隆
 - git clone https://github.com/JadeXusq/chineseChess.git

## 代码目录结构
  - controller              ------控制器目录
  	index.js                ------主控制器，初始化应用、路由及静态文件目录
  	socketController.js     ------websocket控制器，封装websocket创建过程，抛出初始化websocket事件回调方法
  - lib
    - db        			      ------数据库相关方法封装
  - public        			    ------前端静态文件存放位置
  - views        			      ------前端路由视图存放位置
  	chess.html       		    ------详情路由视图文件
  	login.html              ------登录路由视图文件
  - app.js        			    ------后台入口文件
  - rank.sql        		    ------数据库表创建文件，可导入到MySQL生成对应表

## 安装数据库及建表
 - 下载mysql(https://dev.mysql.com/downloads/mysql),
 - 下载Navicat for MySQL
 - 创建数据库，并在数据库中运行rank.sql文件实现建表
 - 修改lib/db/index.js文件的数据库账号密码配置

## 安装运行环境依赖及运行nodeJs服务器
```javascript
 //下载nodeJs(内含npm包,下载地址: https://nodejs.org/en/download/),安装完node -v,npm -v测试是否安装成功及查看版本号，具体这边不在赘述

 //安装cnpm淘宝镜像
 npm install -g cnpm --registry=https://registry.npm.taobao.org

 //进入项目
 cd chineseChess

 //安装依赖
 cnpm install

 //运行nodeJs服务器
 npm run serve
 ```

## 浏览器运行开始对战（第三人以上可观战）
 - 浏览器访问，多个浏览器通过( http://localhost:8882/login )登录,进入象棋对战页面
 - 至此项目搭建完成，用你的智慧去赢得这场胜利吧！
