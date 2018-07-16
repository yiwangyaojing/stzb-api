
const express = require('express');
// 导入socket.io模块，自动提供浏览器端
const socket = require('socket.io');
const http = require('http');

const app = express();

// 创建服务器
const server = http.Server(app);
// 创建socket实例
const io = socket(server);

// 登录人的数量
var num = 0;

io.on('connection', function(socket,req){
    console.log('已经进入小型聊天室');
    var addUser = false;
    //当用户增加进入时
	socket.on('add',function(data){
		++num
		addUser = true
		//设置当前人的名字
		var name = data.name
		var hy = name
		console.log(hy)
		//向所有人的浏览器返回消息,广播通知
        io.emit('jojn', {
            hy:hy,
            num:num
        })
		console.log('发送')
		
		
		//用户退出时
		socket.on('disconnect', function(){
            --num;
            io.emit('tuichu', {
                num:num,
                name:name
           	})
			console.log('有人离开了')
        })
		
		//用户发送消息时
		
		socket.on('content',function(data){
			var content = data.content
			io.emit('all', {
                name:name,
                content:content
           	})
		})
		
	})
  	
	
})



server.listen(2100, function(){
    console.log('聊天室端口连接成功-2100');
})
