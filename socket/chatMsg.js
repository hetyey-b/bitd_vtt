const guestAliasManager = require('./util/guestAliasManager');

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        socket.on('chat_msg', (msg) => {
            console.log(`>> ${msg.message}`);
            if (msg.from) {
                io.emit('chat_msg', {
                    message: msg.message,
                    from: msg.from,
                    date: Date.now(),
                });
                return;
            }

            io.emit('chat_msg', {
                message: msg.message,
                from: guestAliasManager.getAlias(socket.id),
                date: Date.now(),
            });
            return;
        });

        socket.on('disconnect', () => {
            guestAliasManager.deleteAlias(socket.io);
        });
    });
}