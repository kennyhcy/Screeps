// BaseTower.js
// 2021-03-15

var CONSTS = require('Sys').CONSTS;
        // // Tower roles:
        // TOWER_ROLE_NORMAL: 'normal',
        // TOWER_ROLE_MILITARY_ONLY: 'military_only',
        // TOWER_ROLE_CIVILIAN_ONLY: 'civilian_only',

var baseTower = {
    run: function (tower) {
        var tower_role = Memory.towers[tower.id].role;

        if (tower_role == CONSTS.TOWER_ROLE_NORMAL) {
            var ret = this._attack(tower);
            if (!ret) {
                var ret = this._repair(tower);
            }
        }

        if (tower_role == CONSTS.SPAWN_ROLE_MILITARY_ONLY) {
            var ret = this._attack(tower);
        }

        if (tower_role == CONSTS.SPAWN_ROLE_CIVILIAN_ONLY) {
            var ret = this._repair(tower);
        }
    },

    _attack: function (tower) {
        var target;
        if (!target) {
            target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        if (target) {
            tower.attack(target);
            return true;
        } else { return false }
    },

    _repair: function (tower) {
        var target;
        if (!target) {
            var targets = tower.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax
                    //&& structure.hits < 1000000
                }
            });
            if (targets.length > 0) {
                targets.sort((a, b) => a.hits - b.hits);
                target = targets[0];
            }
        };

        // if (!target) {
        //     var target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        //         filter: (structure) => {
        //             return structure.hits < structure.hitsMax
        //                 && structure.hits < 1000000
        //         }
        //     });
        // };

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
        };
        if (target) {
            tower.repair(target);
            return true;
        } else { return false }

    },

}

module.exports = baseTower;

