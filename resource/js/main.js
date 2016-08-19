window.onload = function(){
	var chat = new Chat();
	chat.init();
};

//定义Chat类
var Chat = function(){
	this.socket = null;
};

Chat.prototype =  {
	init: function () {
		var self = this;
		this.socket = io.connect();
		//监听socket的connect事件
		this.socket.on('connect',function(){
			//连接服务器后显示昵称输入框
			document.getElementById('info').textContent = 'get yourself a nickname';
			document.getElementById('nickWrapper').style.display = 'block';
			document.getElementById('nicknameInput').focus();
			console.log("you has connected the server!");
		});

		this.socket.on('nickExisted',function(){
			document.getElementById('info').textContent = 'nickname is taken, choose another please';
			document.getElementById('nickWrapper').style.display = 'block';
			document.getElementById('wrapper').style.display = 'none';
			document.getElementById('nicknameInput').focus();
		});

		this.socket.on('loginSuccess',function(){
			document.title = 'chat room';
			document.getElementById('loginWrapper').style.display = 'none';
			document.getElementById('msgInput').focus();//让输入框获得焦点
		});

		this.socket.on('system',function(nickName,userCount,type){
			var msg = nickName+(type == 'login'?' joined':' left'),
				p = document.createElement('p');
				p.textContent = msg;
				document.getElementById('historyMsg').appendChild(p);
				document.getElementById('status').textContent = userCount+(userCount>1?'users':' user'+' online');
		});
		
		document.getElementById('loginBtn').addEventListener('click',function(){
			var nickName = document.getElementById('nicknameInput').value;
			if(nickName.trim().length!==0){
				self.socket.emit('login',nickName);
			} else {
				document.getElementById('nicknameInput').focus();
			}
		},false);
	}
};