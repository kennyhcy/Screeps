// BaseTower.js
// 2021-03-09 08:52

var CONSTS = require('Sys').CONSTS;

var baseTower = {
    run: function (tower) {
        var memory = Memory.towers[tower.id];
        this[memory.role].run(tower);
    },

    [CONSTS.TOWER_ROLE_NORMAL]:
    {
        run: function (ttower) {
            var tower = Game.structures[ttower.id];
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                tower.attack(target);
            }

            if (!target) {
                var filter_my_structure = {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax
                    }
                };

                var filter_basic_structure = {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_ROAD
                            || structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_STORAGE
                        ) && structure.hits < structure.hitsMax
                    }
                };

                var target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, filter_my_structure);
                if (!target) {
                    target = tower.pos.findClosestByRange(FIND_STRUCTURES, filter_basic_structure);
                }

                if (target) {
                    tower.repair(target);
                }
            }
        }
    }
}


module.exports = baseTower;
