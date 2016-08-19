var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [];
app.use('/',express.static(__dirname+'/resource'));
server.listen(8080);

io.on('connection',function(socket){
	console.log('connected');
	//设置昵称
	socket.on('login',function(nickname){
		if(users.indexOf(nickname)>-1){
			socket.emit('nickExisted');//socket.emit('foo')是向自己发送该'foo'事件，而io.socket.emit('foo'),是向所有人发送该事件
		} else {
			socket.userIndex = users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			socket.broadcast.emit('system',nickname,users.length,'login');//向所连接到服务器的客户端发送当前登录用户的昵称
			//io.socket.emit('...')会报错，此处用broadcast向除自己外的所有客户端广播system事件
			console.log('loginSuccess');
		}
	});
	//断开连接
	socket.on('disconnect',function(){
		users.splice(socket.userIndex,1);
		socket.broadcast.emit('system',socket.nickname,users.length,'logout');
	});

	//接收消息
	socket.on("postMsg",function(msg){
		socket.broadcast.emit('newMsg',socket.nickname,msg);
	});
})