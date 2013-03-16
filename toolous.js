(function(exports) {
	"use strict";
	/**
	 * 
	 * @class toolous
	 */
	var toolous = exports;
	/**
	 * Creates an array object of the captured arguments value from the given index (defaults to 0).
	 * @param {arguments} args the array like arguments object, should always be <i>arguments</i>
	 * @param {integer} from the index to start the copy from, defaults to 0
	 * @param {any...} prepends objects to prepend to the return value. If this is specified 'from' is mandatory
	 * @method toArray
	 */
	toolous.toArray = function(args, from) {
		var ret = Array.prototype.slice.call(args, toolous.nvl(from, 0));
		if (arguments.length > 2) {
			return toolous.toArray(arguments, 2).concat(ret);
			//skipping args and from
		}
		return ret;
	};
	/**
	 * Replaces a value if it's undefined: Returns val if it's defined or def otherwise
	 * @param {any} val the value that will be returned if it is defined.
	 * @param {any} def the default value if val is undefined
	 * @method nvl
	 * */
	toolous.nvl = function(val, def) {
		return toolous.isDef(val) ? val : def;
	};
	/**
	 * returns true iff the value is not undefined
	 * @param {any} o the value to check
	 * @method isDef
	 */
	toolous.isDef = function(o) {
		return typeof o !== "undefined";
	};
	/**
	 * returns true iff the value is a function
	 * @param {any} func the value to check if a function
	 * @method isFunction
	 */
	toolous.isFunction = function(o) {
		return typeof o === "function";
	};

	/**
	 * Merges properties from all Sets all properties in override to target, the rightmost object is the most important
	 * @param {Object} target the object that will be merged into
	 * @param {Object...} sources each source object's properties will be copied to target, the right most source is the most significant. undefined values are ignored.
	 * @return {Object} always returns target
	 * @method merge
	 */
	toolous.merge = function(target, source) {
		if (toolous.isDef(source)) {
			toolous.forEachKey(source, function(key, value) {
				target[key] = value;
			});
		}

		if (arguments.length > 2) {
			return toolous.merge.apply(toolous, toolous.toArray(arguments, 2, target));
		}
		return target;
	};

	/**
	 * Iterates an array as per the Array.forEach spec: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
	 *
	 * @param {Array} arr The array to iterate on
	 * @param {function(any, number, Array)} cb called with each element, it's index and the array
	 * @param {any} thisArg the context to run cb on
	 * @method forEach
	 */
	toolous.forEach = function(arr, cb, thisArg) {
		if (arr.forEach) {
			arr.forEach(cb, thisArg);
		} else {
			for (var i = 0; i < arr.length; ++i) {
				if (toolous.isDef(arr[i])) {
					cb.call(thisArg, arr[i], i, arr);
				}
			}
		}
	};

	/**
	 * Calls a callback for each key and value in an object
	 * @param {Object} obj The object who'se properties will be enumerated
	 * @param {function(string, any)} cb called with each property key and value. Context is the iterated object
	 * @param {boolean} owned if true only the object's own properties will be iterated (see Object.hasOwnProperty), defaults to true
	 * @method forEachKey
	 */
	toolous.forEachKey = function(obj, cb, owned) {
		var any = !toolous.nvl(owned, true);
		for (var key in obj) {
			if (any || obj.hasOwnProperty(key)) {
				cb.call(obj, key, obj[key]);
			}
		}
	};

	/**
	 * Returns a binding of the function to the given object <br/>
	 * Adapted from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind to avoid changing the Function prototype.
	 * @param {string | function} func the function to bind to. If this is a string the method named func on obj is bound.
	 * @param {any} obj the object to bind the function to
	 * @method bind
	 */
	toolous.bind = function(fToBind, oThis) {
		if ( typeof (fToBind) === "string") {
			fToBind = oThis[fToBind];
		}
		if (fToBind.bind) {
			return fToBind.bind.apply(fToBind, toolous.toArray(arguments, 1));
		}
		//Adapted from: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
		if ( typeof fToBind !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("toolous.bind - what is trying to be bound is not callable");
		}

		var aArgs = toolous.toArray(arguments, 2), NOPf = function() {
		}, fBound = function() {
			return fToBind.apply(this instanceof NOPf && oThis ? this : oThis, aArgs.concat(toolous.toArray(arguments)));
		};

		NOPf.prototype = fToBind.prototype;
		fBound.prototype = new NOPf();

		return fBound;
	};
})( typeof exports === 'undefined' ? this.toolous = {} : exports);
