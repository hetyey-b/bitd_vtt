const guestAliases = {};

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
    
            if (guestAliases[socket.id]) {
                io.emit('chat_msg', {
                    message: msg.message,
                    from: guestAliases[socket.id],
                    date: Date.now(),
                });
                return;
            }
            
            const guestAliasesData = require('../data/guestAliasesData');
            const adjective = guestAliasesData.adjectives[Math.floor(Math.random()*guestAliasesData.adjectives.length)];
            const animal = guestAliasesData.animals[Math.floor(Math.random() * guestAliasesData.animals.length)];
            guestAliases[socket.id] = `${adjective} ${animal}`;
    
            io.emit('chat_msg', {
                message: msg.message,
                from: guestAliases[socket.id],
                date: Date.now(),
            });
            return;
        });

        socket.on('disconnect', () => {
            if (guestAliases[socket.id]) {
                console.log(`deleting alias '${guestAliases[socket.id]}'`);
                delete guestAliases[socket.id];
            }
        });
    });
}