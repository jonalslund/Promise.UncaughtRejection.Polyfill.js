# Promise.UncaughtRejection.Polyfill.js
Polyfill for adding global handler for uncaught Promise rejections.

A small extension to the Javascript Promise API to avoid those nasty swallowed exceptions in promises.


## Example
´´´javascript
new Promise(function (resolve, reject) {
	fail(); // call undefined function
});
´´´
The above example will not call the build-in ´´´window.onerror´´´ handler. Some browser will however write a message in the console.
