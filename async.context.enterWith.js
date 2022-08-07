const {AsyncLocalStorage} = require('node:async_hooks');



if (process.argv[process.argv.length - 1] !== '2') {
    const asyncLocalStorage = new AsyncLocalStorage();
    const store = {id: 1};

    // Replaces previous store with the given store object
    asyncLocalStorage.enterWith(store);
    asyncLocalStorage.getStore(); // Returns the store object

    let count = 0;

    setInterval(() => {
        count++;
        if (count === 3) {
            asyncLocalStorage.disable();
            // so the code below return  `undefined`
        }
        console.log(asyncLocalStorage.getStore()); // Returns the same object
    }, 2000);
} else {
    // Second example:
    const {EventEmitter} = require('node:events');
    const demoEvents = new EventEmitter();
    const asyncLocalStorage = new AsyncLocalStorage();
    console.log(asyncLocalStorage.getStore(), 'prints undefined');
    demoEvents.on('my event', () => {
        asyncLocalStorage.enterWith({newID: 12});
    })
    demoEvents.emit("my event");
    console.log(asyncLocalStorage.getStore(), 'prints {newID: 12}');

}



