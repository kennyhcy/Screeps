//Role Worker
//2021-03-15


//CONSTS
var work = require('ActionWork');

const CREEP_TYPE = {
    WORKER: 'worker',
    SOLDIER: 'soldier',
}

const WORKER_ROLE = {
    HARVESTER: 'harvester',     // 采矿
    ENGINEER: 'engineer',       // 建造 / 修墙 / 升级
    UPGRADER: 'upgrader',       // 升级
    TRANSFER: 'transfer',       // 补充 Tower / Extension
    STOREKEEPER: 'storekeeper', // 存入 Container Storage
    REPAIRER: 'repairer',
    // 'defender', // defender room
}

var roleWorker = {
    run: function (creep) {
        this[creep.memory.role].arrange_work(creep);
        if (creep.memory.working) {
            work[creep.memory.working](creep);
        }
    },

    [WORKER_ROLE.HARVESTER]: {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }
            var newName = 'WH-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.HARVESTER,
                        base: base.name,
                        group: 0,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });
        },

        arrange_work: function (creep) { // harvester
            var creep_base = Game.spawns[creep.memory.base];
            if (!creep.memory.working) { // 如果没有工作， 则分配工作
                var target = null;
                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没能量， 则去采矿
                    if (creep.memory.harvest_source) {
                        creep.memory.working = 'harvest';
                        creep.memory.working_target = creep.memory.harvest_source;
                    }
                }
                else { // 如果手上有能量， 则去存储
                    var target = null;
                    if (!target) { // 采矿 ===> Link / Container/ Storage / Extension / Spawn
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_LINK
                                    || struc.structureType == STRUCTURE_EXTENSION
                                    || struc.structureType == STRUCTURE_SPAWN
                                    || struc.structureType == STRUCTURE_STORAGE)
                                    && struc.room.name == creep.memory.working_room
                                    && struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                    }
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_CONTAINER)
                                    && struc.room.name == creep.memory.working_room
                                    && struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                    }
                    if (target) {
                        creep.memory.working = 'store';
                        creep.memory.working_target = target.id;
                    } else {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free! returning base!");
                        creep.moveTo(creep_base);
                    }
                }
            }// end of if
        },// end of arrange work
    }, // end of role harverster


    [WORKER_ROLE.ENGINEER]: {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WE-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.ENGINEER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });
        },

        arrange_work: function (creep) { //engineer
            var working_room = Game.rooms[creep.memory.working_room];
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                var targets = null;
                var target = null;

                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
                    // Dropped resources
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (resource) => {
                                return resource.room == creep.room
                                    && resource.resourceType == RESOURCE_ENERGY
                            }
                        });
                        if (target) {
                            creep.memory.working = 'pickup';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // tombstones
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                            filter: (struct) => {
                                return struct.room == creep.room
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // ruin
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_RUINS, {
                            filter: (struct) => {
                                return struct.room == creep.room
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // container and storage
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    };

                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_STORAGE)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // harvest
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                            filter: (source) => {
                                return source.room.name != creep.memory.working_room
                            }
                        });
                        if (target) {
                            creep.memory.working = 'harvest';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // 实在没有资源, 就从spawn里拿
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_SPAWN)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                } else { // 如果手上有能量

                    // 建造
                    if (!target) {
                        targets = working_room.find(FIND_MY_CONSTRUCTION_SITES);
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'build';
                            creep.memory.working_target = target.id;
                        }
                    }

                    //修路
                    if (!target) {
                        targets = working_room.find(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_ROAD
                                    || struct.structureType == STRUCTURE_CONTAINER)
                                    && struct.hits < struct.hitsMax
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'repair';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // 升级
                    if (!target) {
                        //console.log('check point', creep_base.room.controller);
                        target = working_room.controller;
                        creep.memory.working = 'upgrade';
                        creep.memory.working_target = target.id;

                    }
                }
                // no work to do
                if (!target) {
                    //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                    creep.moveTo(Game.spawns[creep.memory.base]);
                }
            }// end of if
        }, // end of work arrange
    }, // end of role engineer

    [WORKER_ROLE.UPGRADER]: {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WU-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.UPGRADER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_UPGRADER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { //upgrader
            //var creep = Game.creeps[icreep.name];

            var creep_base = Game.spawns[creep.memory.base];
            var creep_working_room = Game.rooms[creep.memory.working_room];

            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                //var targets = null;
                var target = null;
                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
                    // container and storage
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_STORAGE)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }
                    // harvest
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                        if (target) {
                            creep.memory.working = 'harvest';
                            creep.memory.working_target = target.id;
                        }
                    }

                } else { // 如果手上有能量

                    // 升级
                    if (!target) {
                        //console.log('check point', creep_base.room.controller);
                        target = creep_working_room.controller;
                        creep.memory.working = 'upgrade';
                        creep.memory.working_target = target.id;

                    }
                }

                // no work to do
                if (!target) {
                    //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                    creep.moveTo(creep_base);
                }

            }// end of work distribute
        },// end of run
    },// end of role upgrader


    [WORKER_ROLE.TRANSFER]: {
        new: function (base, version) {
            if (!version || version > 2) {
                version = 2;
            }
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WT-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.TRANSFER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_TRANSFER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { // transfer
            //var creep = Game.creeps[icreep.name];
            var creep_base = Game.spawns[creep.memory.base];

            var targets = [];
            var target = null;
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.working = null;
                creep.memory.working_target = null;
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) { // 有能量，则存入Tower > Spawn > Extension, 

                    if (!target) {
                        targets = creep.room.find(FIND_MY_STRUCTURES, {
                            filter: (tower) => {
                                return (tower.structureType == STRUCTURE_TOWER
                                    || tower.structureType == STRUCTURE_SPAWN
                                    || tower.structureType == STRUCTURE_EXTENSION)
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > tower.store.getUsedCapacity(RESOURCE_ENERGY)
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    };

                    if (!target) {
                        targets = creep.room.find(FIND_MY_STRUCTURES, {
                            filter: (tower) => {
                                return (tower.structureType == STRUCTURE_TOWER
                                    || tower.structureType == STRUCTURE_SPAWN
                                    || tower.structureType == STRUCTURE_EXTENSION)
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    };
                }
                else { // 无能量， 则从 Storage > container 中取

                    if (!target) {
                        target = creep_base.room.storage;
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    if (!target) {
                        targets = creep_base.room.find(FIND_STRUCTURES, {
                            filter: (struct) => struct.structureType == STRUCTURE_CONTAINER
                                && struct.store[RESOURCE_ENERGY] > 0
                        });
                        if (targets.length > 0) {
                            targets.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
                            target = targets[0];
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // no work to do
                    if (!target) {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                        creep.moveTo(creep_base);
                    }
                }
            }// end of if
        },//end of arrange work
    }, //end of role transfer


    [WORKER_ROLE.STOREKEEPER]: {
        new: function (base, version) {
            if (!version || version > 2) {
                version = 2;
            }
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WS-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.STOREKEEPER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });
        },

        arrange_work: function (creep) { // storekeeper
            //var creep = Game.creeps[icreep.name];
            var creep_base = Game.spawns[creep.memory.base];

            var targets = [];
            var target = null;
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.working_target = null;
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) { // 有能量，则存入Storage > Spawn > extension > container, 
                    if (!target) {
                        targets = creep_base.room.find(FIND_MY_STRUCTURES, {
                            filter: (storage) => {
                                return storage.structureType == STRUCTURE_STORAGE
                                    && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'store';
                            creep.memory.working_target = target.id;
                        }

                    }

                    if (!target) {
                        targets = creep.room.find(FIND_MY_STRUCTURES, {
                            filter: (storage) => {
                                return (storage.structureType == STRUCTURE_SPAWN
                                    || storage.structureType == STRUCTURE_EXTENSION
                                    || storage.structureType == STRUCTURE_CONTAINER)
                                    && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'store';
                            creep.memory.working_target = target.id;
                        }

                    }

                } else { // 无能量， 则从 LINK(role center) 中取

                    targets = creep_base.room.find(FIND_MY_STRUCTURES, {
                        filter: (center) => {
                            return center.structureType == STRUCTURE_LINK
                                && Memory.links[center.id].role == 'center'
                        }
                    });

                    if (targets.length > 0) {
                        target = targets[0];
                        //console.log(target);
                        creep.memory.working = 'withdraw';
                        creep.memory.working_target = target.id;
                    }

                    // no work to do
                    if (!target) {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                        creep.moveTo(creep_base);
                    }
                }

            } // end of if
        },//end of arrange work
    }, // end of role storekeeper

    [WORKER_ROLE.REPAIRER]: {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WR-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.REPAIRER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });
        },

        arrange_work: function (creep) { //repairer
            var working_room = Game.rooms[creep.memory.working_room];
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                var targets = null;
                var target = null;

                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
                    // Dropped resources
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (resource) => {
                                return resource.room == creep.room
                                    && resource.resourceType == RESOURCE_ENERGY
                            }
                        });
                        if (target) {
                            creep.memory.working = 'pickup';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // tombstones
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                            filter: (struct) => {
                                return struct.room == creep.room
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // ruin
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_RUINS, {
                            filter: (struct) => {
                                return struct.room == creep.room
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // container and storage
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    };

                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_STORAGE)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // harvest
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                            filter: (source) => {
                                return source.room.name != creep.memory.working_room
                            }
                        });
                        if (target) {
                            creep.memory.working = 'harvest';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // 实在没有资源, 就从spawn里拿
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_SPAWN)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                } else { // 如果手上有能量
                    //修路
                    if (!target) {
                        targets = working_room.find(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_ROAD
                                    || struct.structureType == STRUCTURE_WALL
                                    || struct.structureType == STRUCTURE_CONTAINER)
                                    && struct.hits < struct.hitsMax
                            }
                        });
                        if (targets.length > 0) {
                            // targets.sort((a, b) => a.hits - b.hits);
                            target = targets[0];
                            creep.memory.working = 'repair';
                            creep.memory.working_target = target.id;
                        }
                    }
                }
                // no work to do
                if (!target) {
                    //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                    creep.moveTo(Game.spawns[creep.memory.base]);
                }
            }// end of if
        }, // end of work arrange
    }, // end of role engineer





} // end of roleWorker

module.exports = roleWorker;
