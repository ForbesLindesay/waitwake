var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    jshint = require('jshint');

[vows.describe('Coding Style').addBatch({
	'The source code':{
		topic:fs.readFileSync('./index.js') + "",
		'meets coding standards':function(topic){
			assert.isTrue(jshint.JSHINT(topic), 'Fails coding standards:\n' + jshint.JSHINT.errors.map(function(e){
				return 'line:'+e.line+' char:'+e.character+' '+e.reason+'\n\t'+e.evidence;
			}).join("\n"));
		}
	}
}),
vows.describe('Type-Checking').addBatch({
	'A WaitWake': {
		topic:require('./index'),
		'throws an exception if you give wait a non-function for a callback': function(topic){
			assert.throws(function(){topic.wait('hi', false);}, TypeError);
		},
		'throws an exception if you give wait a non-string for a name':function(topic){
			assert.throws(function(){topic.wait(false, function(){})});
		},
		'throws an exception if you give wake a non-string for a name':function(topic){
			assert.throws(function(){topic.wake(false, function(){})});
		},
	}
}).addBatch({
	'A WaitWake':{
		topic:require('./index'),
		'can be waited on without an exception':function(topic){
			assert.doesNotThrow(function(){topic.wait('hi', function(){});}, Error);
		},
		'can be waken without an exception':function(topic){
			assert.doesNotThrow(function(){topic.wake('hi');}, Error);
		},
		'can be cancelled without an exception':function(topic){
			assert.doesNotThrow(function(){topic.wait('hi',function(){}).cancel();}, Error);
		}
	}
}),
vows.describe('Normal Operation').addBatch({
	'A WaitWake':{
		topic:require('./index'),
		'supports being waited on then woken':{
			topic: function(parent){
				var self = this;
				parent.wait('he',function(name){self.callback(null,name);});
				parent.wake('he');
			},
			'and calls back with the name':function(topic){
				assert.strictEqual(topic, 'he');
			}
		},
		'attempting to wake many times':{
			topic:function(parent){
				var calls = 0;
				var self = this;
				parent.wait('wo', function(){
					calls++;
				});
				setTimeout(function(){
					self.callback(null, calls);
				},200);
				parent.wake('wo');
				parent.wake('wo');
				parent.wake('wo');
				parent.wake('wo');
			},
			'has no effect':function(topic){
				assert.strictEqual(topic, 1);
			}
		},
		'with a cancelled wait':{
			topic:function(parent){
				var calls = 0;
				var self = this;
				parent.wait('ba', function(){
					calls++;
				}).cancel();
				setTimeout(function(){
					self.callback(null, calls);
				},200);
				parent.wake('ba');
				parent.wake('ba');
			},
			'does not trigger its wait':function(topic){
				assert.strictEqual(topic, 0);
			}
		}
	}
}),
vows.describe("Clean").addBatch({
	"A function clean":{
		topic:function(){return require('./index').clean},
		'exists':function(topic){
			assert.isFunction(topic);
		},
		'and has no effect other than on performance':function(topic){

		}
	}
})
].forEach(function(description){
	if(require.main === module){
		description.run();
	}else{
		description.export(module);
	}
})