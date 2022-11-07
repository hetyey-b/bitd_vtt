const guestAliasManager = require('./util/guestAliasManager');

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        socket.on('dice', (data) => {
            console.log(`>> rolling d${JSON.stringify(data)}`);
            
            const sides = data.sides;
            
            if (!Number.isInteger(sides)) {
                return;
            }
            if (sides <= 0) {
                return;
            }
           
            io.emit('dice', {
                result: 1 + Math.floor(Math.random() * sides),
                sides,
                from: guestAliasManager.getAlias(socket.id),
                date: Date.now(),
            });
        });
    });
}