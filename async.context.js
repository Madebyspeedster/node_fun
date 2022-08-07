const http = require('node:http');
const assert = require("node:assert")
const {AsyncLocalStorage} = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();


const anotherAsyncStorage = new AsyncLocalStorage();
const getCurrentIdWithinAsyncStorage = () => {
    // anotherAsyncStorage.getStore()
    //Returns the current store.
    //If called outside an asynchronous context initialized by calling asyncLocalStorage.run()
    // or asyncLocalStorage.enterWith(), it returns undefined.
    console.log(anotherAsyncStorage.getStore());
    anotherAsyncStorage.disable();
    setTimeout(() => {
        assert.strictEqual(anotherAsyncStorage.getStore(), undefined, 'Should be undefined')
    })
}
anotherAsyncStorage.run({id: 'Hello'}, getCurrentIdWithinAsyncStorage);


function logWithId(msg) {
    console.log(asyncLocalStorage.getStore(), "asyncLocalStorage.getStore()")
    const id = asyncLocalStorage.getStore();
    console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
    asyncLocalStorage.run(idSeq++, () => {
        logWithId('start');
        // Imagine any chain of async operations here
        setImmediate(() => {
            logWithId('finish');
            res.end();
        });
        setImmediate(() => {
            logWithId('finish');
            res.end();
        });
        setTimeout(() => {
            logWithId('finish 2 sec');
            res.end();
        }, 2000);
        setImmediate(() => {
            logWithId('finish');
            res.end();
        });
        setImmediate(() => {
            logWithId('finish');
            res.end();
        });
    });
}).listen(8080);


http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
// 0: start
// 0: finish
// 0: finish
// 0: finish
// 0: finish
// 1: start
// 1: finish
// 1: finish
// 1: finish
// 1: finish
// 0: finish 2 sec
// 1: finish 2 sec
