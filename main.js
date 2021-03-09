//main.js
//2021-03-09 16:38
var sys = require('Sys');
var CONSTS = require('Sys').CONSTS;
var baseSpawn = require('BaseSpawn');
var baseTower = require('BaseTower');
var baseLink = require('BaseLink');

var roleSoldier = require('RoleSoldier');
var roleWorker = require('RoleWorker');

module.exports.loop = function () {
    sys.run();

    for (var i in Game.spawns) {
        var base = Game.spawns[i];
        baseSpawn.run(base); // spawn creeps
    }

    for (var s in Game.structures) {
        var struct = Game.structures[s];
        if (struct.structureType == STRUCTURE_TOWER) {
            baseTower.run(struct); // Towers
        } else if (struct.structureType == STRUCTURE_LINK) {
            baseLink.run(struct); // Links
        }
    }

    for (var c in Game.creeps) {
        var creep = Game.creeps[c];
        if (!creep) {
            console.log('ERROR: Creep : [', c, "] unkonwn!");
        } else if (creep.memory.creepType == CONSTS.CREEP_TYPE_SOLDIER) {
            roleSoldier.run(creep);
        } else if (creep.memory.creepType == CONSTS.CREEP_TYPE_WORKER) {
            roleWorker.run(creep);
        }
    }

}

