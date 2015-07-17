function Download () {
	var socket = io.connect('/');
	var socketIO = undefined;

	function ioInit () {
		socket.on('connect', function() {
			console.log(socket.socket.sessionid)
		});

		socket.on('update', function(data){
			self.draw(data);
		});
		
		this.download = function(data) {
			socket.emit('download', data);
		}

		socket.on('progress', function(data){
			self.progress(data.pourcent);
		});
	}

	function start() {
		socketIO = new ioInit();
		socketIO.download({});
	}

	this.progress = function(pourcent){
		console.log(pourcent)
		$("progress").attr('value', pourcent);
	}

	this.download = function() {
		socket.emit('download');
	}

	this.initProgress = function(){
		socketIO = new ioInit();
		return self;
	};
}