module( "toolous");

test("toolous.isDef", function() {
	strictEqual(toolous.isDef(0),true,"0");
	strictEqual(toolous.isDef(null),true,"null");
	strictEqual(toolous.isDef(false),true,"false");
	strictEqual(toolous.isDef(""),true,"empty string");
	strictEqual(toolous.isDef(undefined),false,"undefined");
});

test("toolous.isFunction", function() {
	strictEqual(toolous.isFunction(test),true);
	strictEqual(toolous.isFunction(String),true);
	strictEqual(toolous.isFunction(0),false);
	strictEqual(toolous.isFunction(false),false);
	strictEqual(toolous.isFunction(""),false);
});

test("toolous.nvl", function() {
	strictEqual(toolous.nvl(0,1),0,"nvl on falsish value - 0");
	strictEqual(toolous.nvl(false,1),false,"nvl on falsish value - false");
	strictEqual(toolous.nvl(null,1),null,"nvl on falsish value - null");
	strictEqual(toolous.nvl(undefined,1),1,"nvl on undefined");
	strictEqual(toolous.nvl(undefined,2),2,"nvl on undefined");
	strictEqual(toolous.nvl(undefined,3),3,"nvl on undefined");
});

test("toolous.toArray", function() {
	function testArgs(args, from, prepends) {
		var expected = args.slice(from || 0);
		if(prepends) {
			expected = prepends.concat(expected);
		}
		// console.log(expected);
		function call() {
			var sendArgs = [arguments,from];
			if(prepends) {
				sendArgs = sendArgs.concat(prepends);
			}
			var res1 = toolous.toArray.apply(toolous,sendArgs);
			deepEqual(res1, expected);

			if(from === 0 && prepends.length === 0) {
				var res2 = toolous.toArray(arguments);
				deepEqual(res2,expected);
			}
		}
		call.apply(this,args);
	}
	testArgs([1,2,3]); //1 2 3
	testArgs([1,2,3],0,[0]); //0 1 2 3
	testArgs([1,2,3],1,[0]); //0 2 3
	testArgs([1,2,3],5); //
	testArgs([1,2,3],3,[0,3,3]); //0 3 3
	testArgs([1,2,3],1,[0]); // 0 2 3
});

test("toolous.merge", function() {
	function testMerge(target) {
		var objs = arguments;
		var ret = toolous.merge.apply(toolous,arguments);
		strictEqual(target,ret);
		
		for(var key in ret) {
			for(var i = objs.length-1; i >= 0; --i) {
				var obj = objs[i];
				if(toolous.isDef(obj) && obj.hasOwnProperty(key)) {
					strictEqual(ret[key],obj[key]);
					break;
				}
			}
		}
		// console.log(ret);
	}
	testMerge({x:'y'},{a:1}, {b:2},{a:0},{a:3},{f:5},{},undefined, {f:3});
});

test("toolous.bind", function() {
	Function.prototype.bind = null;
	function testBind(prepend) {
		var context = {};
		var sentArgs = [1,2,3];
		function check() {
			strictEqual(context,this);
			var args = toolous.toArray(arguments);
			if(prepend) {
				deepEqual(prepend,args.slice(0,prepend.length));
				deepEqual(sentArgs,args.slice(prepend.length));
			}
			else {
				deepEqual(sentArgs, args);
			}
		}
		
		var bound = toolous.bind.apply(toolous,[check,context].concat(prepend || []));
		bound.apply(this, sentArgs);
		bound.apply({"x":"a"}, sentArgs);
		
		context.check = check;
		bound = toolous.bind.apply(toolous,["check",context].concat(prepend || []));
		bound.apply(this, sentArgs);
		bound.apply({"x":"a"}, sentArgs);
	}
	testBind();
	testBind([0]);
});

test("toolous.forEach", function() {
	Array.prototype.forEach = null;
	function testForeach(arr) {
		var res = [];
		var context = {};
		toolous.forEach(arr, function(elm,i,theArray) {
			strictEqual(context,this);
			strictEqual(arr,theArray);
			res[i] = elm;
		},context);
		deepEqual(arr,res);
	}
	
	testForeach([0]);
	testForeach([0,2,3]);
	testForeach([0,undefined,4]);
	testForeach([0,undefined,undefined,3]);
	testForeach([undefined,0,3,1,3,5,1,2]);
});

test("toolous.forEachKey", function() {
	Array.prototype.forEach = null;
	function testForEachKey(obj, owned) {
		var res = {};
		toolous.forEachKey(obj, function(key,val) {
			strictEqual(this, obj);
			strictEqual(val, obj[key]);
			if(owned) {
				ok(obj.hasOwnProperty(key),"Traverse owned properties only");
			}
			res[key] = val;
		},owned);
		
		for(var key in obj) {
			if((!owned) || obj.hasOwnProperty(key)) {
				strictEqual(res[key],obj[key]);
			}
		}
	}
	
	testForEachKey({
		a: 1,
		b: 2,
		c: undefined
	});
	testForEachKey(new String("string"));
	
	testForEachKey({
		a: 1,
		b: 2,
		c: undefined
	},false);
	testForEachKey(new String("string"),false);
});