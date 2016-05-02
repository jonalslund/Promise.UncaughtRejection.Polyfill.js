(function (Promise) {
	"use strict";

	// No promises - nothing to do
	if (!Promise)
		return;
	// Browser already support a handler - nothing to do
	if (window.onunhandledrejection !== undefined)
		return;

	// Class for overwriting the original promise
	function SafePromise(handler) {
		// create a standard Promise
		var promise = new Promise(handler);
		// Inject catch handlers
		return catchPromise(promise, onUncaughtRejection);
	}
	// Inherit Promise
	SafePromise.prototype = Object.create(Promise.prototype, { constructor: { value: SafePromise } });
	SafePromise.all = Promise.all;
	SafePromise.cast = Promise.cast;
	SafePromise.reject = Promise.reject;
	SafePromise.resolve = Promise.resolve;
	// Define handler for uncaught rejections
	SafePromise.onUncaugthRejection = null;

	// Injects a mandatory catch handler on the promise which is 'disabled' when catch is called explicitly
	function catchPromise(promise, uncaughtRejectionHandler) {
		var errorHandled = false;

		// Inject a mandatory catch handler
		promise = promise.catch(function (error) {
			// Error not handled let's call the error handler
			if (!errorHandled) {
				uncaughtRejectionHandler({ error: error, promise: promise });
			}

			// Always pass on the error - either to other catch handlers or to the runtime
			throw error;
		});

		// override the catch method in order to disable the mandatory catch handler when called
		promise.catch = function () {
			errorHandled = true;
			// forward to base Promise
			return Promise.prototype.catch.apply(promise, arguments);
		};

		// override the then method in order to inject new catch handlers
		promise.then = function () {
			return catchPromise(Promise.prototype.then.apply(promise, arguments), uncaughtRejectionHandler);
		};

		return promise;
	}

	function onUncaughtRejection(event) {
		if (SafePromise.onUncaugthRejection) {
			SafePromise.onUncaugthRejection(event);
		}
	}

	// export
	window.Promise = SafePromise;

}(window.Promise));