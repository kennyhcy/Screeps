//main.js
//2021-03-09 16:38
var sys = require('Sys');
var baseSpawn = require('BaseSpawn');
var baseTower = require('BaseTower');
var baseLink = require('BaseLink');
var baseTerminal = require('BaseTerminal');

var roleSoldier = require('RoleSoldier');
var roleWorker = require('RoleWorker');

module.exports.loop = function () {
    // sys.run();
    sys.initialSettings();
    sys.cleansing();

    sys.arrange_harvester();
    sys.arrange_worker();
    sys.arrange_soldier();

    sys.userCommand();

    for (var s in Game.structures) {
        var struct = Game.structures[s];
        if (struct.structureType == STRUCTURE_TOWER) {
            baseTower.run(struct); // Towers
        } else if (struct.structureType == STRUCTURE_LINK) {
            baseLink.run(struct); // Links
        } else if (struct.structureType == STRUCTURE_TERMINAL) {
            baseTerminal.run(struct); // terminal
        }
    }

    for (var c in Game.creeps) {
        var creep = Game.creeps[c];
        // if (!creep.memory.working_room) {
        //     creep.memory.working_room = creep.room.name;
        // }
        if (!creep) {
            console.log('ERROR: Creep : [', c, "] unkonwn!");
        } else if (creep.memory.creepType == 'soldier') {
            roleSoldier.run(creep);
        } else if (creep.memory.creepType == 'worker') {
            roleWorker.run(creep);
        }
    }

    for (var i in Game.spawns) {
        var base = Game.spawns[i];
        baseSpawn.run(base); // spawn creeps
    }

}
