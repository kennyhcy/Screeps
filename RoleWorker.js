//Role Worker
//2021-03-15


//CONSTS
var work = require('./ActionWork');
const TASK = require('./TaskWork');

const CREEP_TYPE = {
    WORKER: 'worker',
    SOLDIER: 'soldier',
}

const WORKER_ROLE = {
    HARVESTER: 'harvester',     // 采矿
    ENGINEER: 'engineer',       // 建造 / 修墙 / 升级
    UPGRADER: 'upgrader',       // 升级
    TRANSFER: 'transfer',       // 补充 Tower / Extension
    REFILLER: 'refiller',       // 补充 Tower / Extension
    STOREKEEPER: 'storekeeper', // 存入 Container Storage
    REPAIRER: 'repairer',
    // TRADER: 'trader', // 商人
    CARRIER: 'carrier',
    // 'defender', // defender room
}

var roleWorker = {
    WORKER_ROLE: WORKER_ROLE,

    run: function (creep) {
        // 统计数量
        var working_room = creep.memory.working_room;
        var creep_role = creep.memory.role;
        //console.log(creep.name);
        // Game.rooms[working_room].memory.workerCount[creep_role] += 1;
        Memory.rooms[working_room].workerCount[creep_role] += 1;

        this[creep.memory.role].arrange_work(creep);
        if (creep.memory.working) {
            work[creep.memory.working](creep);
        }

        if (!creep.memory.working) {
            this[creep.memory.role].arrange_work(creep); // 跑两遍 不发呆
            if (creep.memory.working) {
                work[creep.memory.working](creep);
            }
        }

        if (creep.memory.task) {
            TASK.execute(creep);
        }
    },

    [WORKER_ROLE.HARVESTER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }
            var newName = 'WH-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });
        },

        arrange_work: function (creep) { // harvester
            var base_room = Game.rooms[creep.memory.base_room];
            var working_room = Game.rooms[creep.memory.working_room];
            if (!creep.memory.working) { // 如果没有工作， 则分配工作
                var target = null;
                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没能量， 则去采矿
                    if (creep.memory.harvest_source) {
                        creep.memory.working = 'harvest';
                        creep.memory.working_target = creep.memory.harvest_source;
                    }
                }
                else if (creep.store[RESOURCE_ENERGY] > 0) { // 如果手上有能量， 则去存储
                    var target = null;

                    if (!target) { // 采矿 ===> Link / Container / Extension / Storage / Spawn
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_LINK
                                    || struc.structureType == STRUCTURE_CONTAINER
                                    || struc.structureType == STRUCTURE_EXTENSION
                                    || struc.structureType == STRUCTURE_STORAGE
                                    || struc.structureType == STRUCTURE_SPAWN)
                                    && struc.room.name == creep.memory.working_room
                                    && struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                    }

                    // 返回基地库存
                    if (!target) { // 采矿 ===> Link / Container/ Storage / Extension / Spawn
                        var targets = base_room.find(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_LINK
                                    || struc.structureType == STRUCTURE_CONTAINER
                                    || struc.structureType == STRUCTURE_EXTENSION
                                    || struc.structureType == STRUCTURE_STORAGE
                                    || struc.structureType == STRUCTURE_SPAWN)
                                    && struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                        }
                    }

                    if (target) {
                        creep.memory.working = 'store';
                        creep.memory.working_target = target.id;
                    } else {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free! returning base!");
                        creep.moveTo(Game.spawns[creep.memory.base]);
                    }
                }
                else { // 如果手上有其他资源
                    var target = null;

                    if (!target) { // 采矿 ===> Container / Storage
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_CONTAINER
                                    || struc.structureType == STRUCTURE_STORAGE)
                                    && struc.room.name == creep.memory.working_room
                                    && struc.store.getFreeCapacity() > 0
                            }
                        });
                    }

                    // 返回基地库存
                    if (!target) { // 采矿 ===> Link / Container/ Storage / Extension / Spawn
                        var targets = base_room.find(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_CONTAINER
                                    || struc.structureType == STRUCTURE_STORAGE)
                                    && struc.store.getFreeCapacity() > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                        }
                    }

                    if (target) {
                        creep.memory.working = 'store';
                        creep.memory.working_target = target.id;
                    } else {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free! returning base!");
                        creep.moveTo(Game.spawns[creep.memory.base]);
                    }

                }
            }// end of if
        },// end of arrange work
    }, // end of role harverster


    [WORKER_ROLE.ENGINEER]: {
        new: function (base, working_room, version) {
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
            var newName = 'WE-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });
        },

        arrange_work: function (creep) { //engineer
            var working_room = Game.rooms[creep.memory.working_room];
            var base_room = Game.rooms[creep.memory.base_room];
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                var targets = null;
                var target = null;

                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
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

                    // base => container and storage
                    if (!target) {
                        var targets = base_room.find(FIND_STRUCTURES, {
                            filter: (struct) => {
                                return struct.structureType == STRUCTURE_CONTAINER
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    };

                    if (!target) {
                        if (base_room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                            target = base_room.storage;
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // // Dropped resources
                    // if (!target) {
                    //     target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    //         filter: (resource) => {
                    //             return resource.room == creep.room
                    //                 && resource.resourceType == RESOURCE_ENERGY
                    //         }
                    //     });
                    //     if (target) {
                    //         creep.memory.working = 'pickup';
                    //         creep.memory.working_target = target.id;
                    //     }
                    // }

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
                        // console.log(targets.length);
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
        new: function (base, working_room, version) {
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
            var newName = 'WU-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_UPGRADER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { //upgrader
            //var creep = Game.creeps[icreep.name];
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
                    creep.moveTo(Game.spawns[creep.memory.base]);
                }

            }// end of work distribute
        },// end of run
    },// end of role upgrader


    [WORKER_ROLE.TRANSFER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [CARRY, MOVE];
                    break;
                case 2:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                case 3:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WT-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });

            //console.log('Spawning new harvester: ' + newName, ' ret = ', retCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_TRANSFER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { // transfer
            //var creep = Game.creeps[icreep.name];
            //var creep_base = Game.spawns[creep.memory.base];
            var creep_working_room = Game.rooms[creep.memory.working_room];
            var creep_base_room = Game.rooms[creep.memory.base_room];

            var targets = [];
            var target = null;
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.working = null;
                creep.memory.working_target = null;

                if (creep.store.getUsedCapacity() > 0) { // 有能量，则存入 Storage, 
                    if (!target) {
                        target = creep_base_room.storage;
                    };
                    if (target) {
                        creep.memory.working = 'store';
                        creep.memory.working_target = target.id;
                    }
                }
                else { // 无能量， 则从 container 中取

                    // // Dropped resources
                    // if (!target) {
                    //     target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    //         filter: (resource) => {
                    //             return resource.room.name == creep_working_room.name
                    //                 //&& resource.amount > 0
                    //                 && resource.resourceType == RESOURCE_ENERGY
                    //         }
                    //     });
                    //     if (target) {
                    //         creep.memory.working = 'pickup';
                    //         creep.memory.working_target = target.id;
                    //     }
                    // }

                    // tombstones
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                            filter: (struct) => {
                                return struct.room.name == creep_working_room.name
                                    && struct.store.getUsedCapacity() > 0
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
                                return struct.room.name == creep_working_room.name
                                    && struct.store.getUsedCapacity() > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // container
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struct) => struct.structureType == STRUCTURE_CONTAINER
                                && struct.room.name == creep_working_room.name
                                && struct.store.getUsedCapacity() > 0
                        });
                        if (target) {
                            //targets.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
                            // target = targets[0];
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    //console.log(creep.name, ' : ', creep.memory.working, creep.memory.working_target);

                    // no work to do
                    if (!target) {
                        //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                        creep.moveTo(Game.spawns[creep.memory.base]);
                    }
                }
            }// end of if
        },//end of arrange work
    }, //end of role transfer


    [WORKER_ROLE.REFILLER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [CARRY, MOVE];
                    break;
                case 2:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                case 3:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WR' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.REFILLER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: working_room,
                    }
                });

            //console.log('Spawning new harvester: ' + newName, ' ret = ', retCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', WORKER_ROLE.REFILLER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { // refiller
            //var creep = Game.creeps[icreep.name];
            //var creep_base = Game.spawns[creep.memory.base];
            var creep_working_room = Game.rooms[creep.memory.working_room];

            var targets = [];
            var target = null;
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.working = null;
                creep.memory.working_target = null;
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) { // 有能量，则存入Tower > Spawn > Extension, 

                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (tower) => {
                                return (tower.structureType == STRUCTURE_TOWER
                                    || tower.structureType == STRUCTURE_SPAWN
                                    || tower.structureType == STRUCTURE_EXTENSION)
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > tower.store.getUsedCapacity(RESOURCE_ENERGY)
                            }
                        });
                        if (target) {

                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    };

                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (tower) => {
                                return (tower.structureType == STRUCTURE_TOWER
                                    || tower.structureType == STRUCTURE_SPAWN
                                    || tower.structureType == STRUCTURE_EXTENSION)
                                    && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            // target = targets[0];
                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    };
                }
                else { // 无能量， 则从 Storage > container 中取

                    if (!target) {
                        target = creep_working_room.storage;
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    if (!target) {
                        targets = creep_working_room.find(FIND_STRUCTURES, {
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
                        creep.moveTo(Game.spawns[creep.memory.base]);
                    }
                }
            }// end of if
        },//end of arrange work
    }, //end of role transfer



    [WORKER_ROLE.STOREKEEPER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [CARRY, MOVE];
                    break;
                case 2:
                    parts = [CARRY, MOVE, CARRY, MOVE];
                    break;
                case 3:
                    parts = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WS-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });
        },

        arrange_work: function (creep) { // storekeeper
            //var creep = Game.creeps[icreep.name];
            // var creep_base = Game.spawns[creep.memory.base];
            var creep_working_room = Game.rooms[creep.memory.working_room];

            var targets = [];
            var target = null;
            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.working_target = null;
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) { // 有能量，则存入Storage > Spawn > extension > container, 
                    if (!target) {
                        targets = creep_working_room.find(FIND_MY_STRUCTURES, {
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

                    targets = creep_working_room.find(FIND_MY_STRUCTURES, {
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
                        creep.moveTo(Game.spawns[creep.memory.base]);
                    }
                }

            } // end of if
        },//end of arrange work
    }, // end of role storekeeper

    [WORKER_ROLE.REPAIRER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, CARRY, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [WORK, CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WR-' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
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
                        working_room: working_room,
                    }
                });
        },

        arrange_work: function (creep) { //repairer
            if (creep.memory.working) {
                return true; // 有工作了就去干
            }

            //如果没有工作，或者工作已经完成， 则分配工作
            var working_room = Game.rooms[creep.memory.working_room];
            var targets = null;
            var target = null;

            if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
                // // Dropped resources
                // if (!target) {
                //     target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                //         filter: (resource) => {
                //             return resource.room == creep.room
                //                 && resource.resourceType == RESOURCE_ENERGY
                //         }
                //     });
                //     if (target) {
                //         creep.memory.working = 'pickup';
                //         creep.memory.working_target = target.id;
                //     }
                // }

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
                    if (creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                        target = creep.room.storage;
                    }
                    // target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    //     filter: (struct) => {
                    //         return (struct.structureType == STRUCTURE_STORAGE)
                    //             && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    //     }
                    // });
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

                // 实在没有资源, 就从spawn里拿 //实在没能量也不能用spawn能量去刷墙啊 想啥呢
                // if (!target) {
                //     target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                //         filter: (struct) => {
                //             return (struct.structureType == STRUCTURE_SPAWN)
                //                 && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                //         }
                //     });
                //     if (target) {
                //         creep.memory.working = 'withdraw';
                //         creep.memory.working_target = target.id;
                //     }
                // }

            } else { // 如果手上有能量
                //要致富,先修路
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
                        targets.sort((a, b) => a.hits - b.hits); //排个序? 反正CPU有多
                        for (let t of targets) {
                            if (t.structureType == STRUCTURE_WALL
                                && t.hits / t.hitsMax < 0.2) {
                                target = t;
                                break;
                            }

                            if (t.structureType == STRUCTURE_ROAD
                                && t.hits / t.hitsMax < 0.2) {
                                target = t;
                                break;
                            }

                        }

                        if (!target) {
                            target = targets[0];
                        }
                    }
                }
                if (target) {
                    creep.memory.working = 'repair';
                    creep.memory.working_target = target.id;
                }
            }
            // no work to do
            if (!target) {
                //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free!!!");
                creep.moveTo(Game.spawns[creep.memory.base]);
            }

        }, // end of work arrange
    }, // end of role


    [WORKER_ROLE.CARRIER]: {
        new: function (base, working_room, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [CARRY, MOVE];
                    break;
                case 2:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                case 3:
                    parts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                    break;
                default:
                    version = 1;
                    parts = [CARRY, MOVE];
            }

            //var newName = 'WE-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WC' + version + '-' + Game.time % 1000;
            if (!working_room) {
                var working_room = base.room.name;
            }
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CREEP_TYPE.WORKER,
                        role: WORKER_ROLE.CARRIER,
                        base: base.name,
                        group: 0,
                        base_room: base.room.name,
                        working_room: working_room,
                        working: 'carry',
                        task: null,
                    }
                });

            //console.log('Spawning new harvester: ' + newName, ' ret = ', retCreep);
            if (retCreep == 0) {
                //console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_TRANSFER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { // carrier
            //var creep = Game.creeps[icreep.name];
            //var creep_base = Game.spawns[creep.memory.base];
            var creep_working_room = Game.rooms[creep.memory.working_room];
            var creep_base_room = Game.rooms[creep.memory.base_room];

            var targets = [];
            var target = null;

            var terminal_memory = Memory.rooms[creep.memory.working_room].terminal;
            var terminal = Game.getObjectById(terminal_memory.id);

            creep.memory.working = 'carry';

            if (creep.memory.task
                && !creep.memory.task.action) {//如果没有工作，或者工作已经完成， 则分配工作
                creep.memory.task = undefined;
            }

            // link -> storage
            if (!creep.memory.task) {//如果没有工作，或者工作已经完成， 则分配工作
                for (let lid in Memory.links) {
                    let link_memory = Memory.links[lid];
                    if (link_memory['request'] == true && !link_memory['creep']) {
                        creep.memory.task = TASK.assign('carry', creep_base_room.storage.id, lid, RESOURCE_ENERGY);
                        break;
                    }
                }
            }

            // 从storage 搬到 terminal
            if (!creep.memory.task) {
                for (let rs in terminal_memory.request) {
                    if (terminal_memory.request[rs] > terminal.store[rs]) {
                        creep.memory.task = TASK.assign('carry', creep_base_room.storage.id, terminal_memory.id, rs);
                        break;
                    }
                }
            }

            // 从terminal 搬到 storage
            if (!creep.memory.task) {
                for (let rs in terminal_memory.back) {
                    if (terminal_memory.back[rs] > 0 && terminal.store[rs] > 0) {
                        creep.memory.task = TASK.assign('carry', terminal_memory.id, creep_base_room.storage.id, rs);
                        break;
                    }
                }
            }

            // Dropped resources
            if (!creep.memory.task) {
                target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return resource.room.name == creep_working_room.name
                            && resource.amount > 0
                    }
                });
                if (target) {
                    creep.memory.task = TASK.assign('pickup', target.id, creep_base_room.storage.id, target.resourceType);
                }
            }

            // tombstones
            if (!creep.memory.task) {
                target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                    filter: (struct) => {
                        return struct.room.name == creep_working_room.name
                            && struct.store.getUsedCapacity() > 0
                    }
                });
                if (target) {
                    for (let rs in target.store) {
                        creep.memory.task = TASK.assign('carry', target.id, creep_base_room.storage.id, rs);
                        break;
                    }
                }
            }

            // ruin
            if (!creep.memory.task) {
                target = creep.pos.findClosestByRange(FIND_RUINS, {
                    filter: (struct) => {
                        return struct.room.name == creep_working_room.name
                            && struct.store.getUsedCapacity() > 0
                    }
                });
                if (target) {
                    for (let rs in target.store) {
                        creep.memory.task = TASK.assign('carry', target.id, creep_base_room.storage.id, rs);
                        break;
                    }
                }
            }

            // container
            if (!creep.memory.task) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType == STRUCTURE_CONTAINER
                        && struct.room.name == creep_working_room.name
                        && struct.store.getUsedCapacity() > 0
                });
                if (target) {
                    for (let rs in target.store) {
                        creep.memory.task = TASK.assign('carry', target.id, creep_base_room.storage.id, rs);
                        break;
                    }
                }
            }






        },//end of arrange work
    }, //end of role





} // end of roleWorker

module.exports = roleWorker;
