// BaseTower.js
// 2021-03-14 14:48

var CONSTS = require('Sys').CONSTS;

var baseTower = {
    run: function (tower) {
        var memory = Memory.towers[tower.id];
        this[memory.role].run(tower);
    },

    [CONSTS.TOWER_ROLE_NORMAL]:
    {
        run: function (tower) {
            //var tower = Game.structures[tower.id];
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                tower.attack(target);
            }

            if (!target) {
                var target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax
                            && structure.hits < 10000000
                    }
                });
            };
            if (!target) {
                target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_ROAD
                            || structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_STORAGE
                        ) && structure.hits < structure.hitsMax
                            && structure.hits < 1000000
                    }
                });
            };
            if (!target) {
                target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL
                        ) && structure.hits < structure.hitsMax
                            && structure.hits < 10000
                    }
                });
            }

            if (target) {
                tower.repair(target);
            }

        }
    },

    [CONSTS.SPAWN_ROLE_MILITARY_ONLY]:
    {
        run: function (tower) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                tower.attack(target);
            }
        },

    },


    [CONSTS.SPAWN_ROLE_CIVILIAN_ONLY]:
    {
        run: function (tower) {
            var target;
            if (!target) {
                var target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax
                            && structure.hits < 10000000
                    }
                });
            };
            if (!target) {
                target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_ROAD
                            || structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_STORAGE
                        ) && structure.hits < structure.hitsMax
                            && structure.hits < 1000000
                    }
                });
            };
            if (!target) {
                target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL
                        ) && structure.hits < structure.hitsMax
                            && structure.hits < 10000
                    }
                });
            }
            if (target) {
                tower.repair(target);
            }
        },

    },
}

module.exports = baseTower;

