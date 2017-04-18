const http = require('http');
const socket = require('socket.io');
const fs = require('fs');
const app = http.createServer((req, res) => {
	//访问localhost:3003的时候将聊天页面返回
	fs.readFile(__dirname+'/index.html', (err, data) => {
		if(err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}).listen(3003);
console.log('server is start , port 3003');

let io = socket(app);
io.on('connection', socket => {
	//默认输出聊天信息
	io.emit('news', {
		id:'Z',
		msg:'welcome to here!'
	});
	socket.on('reseive', data => {
		//这里使用io是为了能在多个页面可以同步输出
		io.emit('news', data)
	})
});
//关于退出服务器，总有不小心按错，这个是需要两次Ctrl+C退出
// let isExit = false;
// process.on('SIGINT', () => {
// 	if(isExit){
// 		isExit = false;
// 		process.exit();
// 	}else{
// 		isExit = true;
// 		process.stdout.write('Please ^C again to exit this process\n');
//3秒不再次Ctrl+C视为放弃
// 		let timer = setTimeout(function(){
// 			clearTimeout(timer);
// 			isExit = false;
// 		},3000);
// 	}

// })
//这里是按一次然后输入y/Y退出
let isExit = false;
let reset = () => {
	let timer = setTimeout(() => {
		clearTimeout(timer);
		isExit = false;
	}, 5000)
}
process.on('SIGINT', () => {
	isExit = true;
	//若5秒不输入则视为放弃
	reset();
	process.stdout.write('Are you sure exit this process? Y/N\n');
	
})

process.stdin.on('data', (data) => {

	if(!data){

	}else if(data.toString().trim().toLowerCase() === 'y' && isExit){
		process.exit();
	}else{
		process.stdout.write('\n');
	}
})


