# Promise.UncaughtRejection.Polyfill.js
Polyfill for catching uncaught Promise rejections

A small extension to the Javascript Promise API to avoid those nasty swallowed exceptions in promises.


Example
'''new Promise(function (resolve, reject) {
fail() // call undefined function
});