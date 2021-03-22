//BaseTerminal.js
//2021-03-18


var baseTerminal = {

    run: function (terminal) {
        Memory.rooms[terminal.room.name]['terminal']['id'] = terminal.id;
    },
}


module.exports = baseTerminal;

