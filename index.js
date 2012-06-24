var channels = {};


exports.wait = function(name, cb){
	if(typeof name !== 'string') throw new TypeError("'name' must be a string");
	if(typeof cb !== 'function') throw new TypeError("'callback' must be a function");
	
	var c = channels[name]?channels[name]:channels[name]=[];
	c.push(function(){
		if(!done){
			done = true;
			cb(name);
		}
	});
	var id = c.length - 1;
	var done = false;


	return {cancel:function(){
		if(!done){
			done = true;
			c[id] = false;
		}
	}};
};

exports.wake = function(name){
	if(typeof name !== 'string') throw new TypeError("'name' must be a string");

	if(channels[name]){
		var c = channels[name];
		delete channels[name];

		for (var i = 0; i < c.length; i++) {
			if(c[i]) c[i]();
		}
	}
};

exports.clean = function(){
	Object.keys(channels).forEach(function(name){
		var c = channels[name];

		for (var i = 0; i < c.length; i++) {
			if(c[i]) return;
		}

		delete channels[name];
	});
};