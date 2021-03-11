//Role Worker
//2021-03-11 22:30

//CONSTS
var CONSTS = require('Sys').CONSTS;

var roleWorker = {
    run: function (creep) {
        this[creep.memory.role].arrange_work(creep);
        this.execute_work(creep);
        if (!creep.memory.working) {
            this[creep.memory.role].arrange_work(creep); //第一个任务结束后下一个任务得以立即执行
            this.execute_work(creep);
        }
    },


    execute_work: function (creep) { //执行任务: 根据 creep.memory.working 和 creep.memory.working_target
        if (!creep.memory.working) {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
        else if (creep.memory.working == 'harvest') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                && target) {

                var ret = creep.harvest(target);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                }
                else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    console.log('ERROR : ', creep.name, ' harvest fail: ', ret);
                }
            } else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'store') {
            target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                && target && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                var ret = creep.transfer(target, RESOURCE_ENERGY);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                }
                else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    console.log('ERROR : ', creep.name, ' store fail: ', ret);
                }
            }
            else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }

        }
        else if (creep.memory.working == 'pickup') {
            var target = Game.getObjectById(creep.memory.working_target);
            //console.log('check point 348', target);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                && target
                && target.resourceType == RESOURCE_ENERGY
                && target.amount > 0) {

                var ret = creep.pickup(target, RESOURCE_ENERGY);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                }
                else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    console.log('ERROR : ', creep.name, ' pickup fail: ', ret);
                }
            }
            else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'withdraw') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                && target
                && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {

                var ret = creep.withdraw(target, RESOURCE_ENERGY);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                }
                else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    console.log('ERROR : ', creep.name, ' withdraw fail: ', ret);
                }
            }
            else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'build') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                && target) {

                var ret = creep.build(target);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                } else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    console.log('ERROR : ', creep.name, ' build fail: ', ret);
                }
            } else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'refill') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                && target
                && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                var ret = creep.transfer(target, RESOURCE_ENERGY);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                } else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    console.log('ERROR : ', creep.name, ' refill fail: ', ret);
                }
            }
            else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'repair') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                && target
                && target.hits < target.hitsMax) {

                var ret = creep.repair(target);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                } else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    console.log('ERROR : ', creep.name, ' repair fail: ', ret);
                }
            } else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else if (creep.memory.working == 'upgrade') {
            var target = Game.getObjectById(creep.memory.working_target);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                && target) {

                var ret = creep.upgradeController(target);
                if (ret == OK || ret == ERR_BUSY) {
                    // console.log('Check point1');
                } else if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    console.log('ERROR : ', creep.name, ' upgradeController fail: ', ret);
                }
            } else {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
        else {
            console.log('ERROR: ', creep.name, " : no logic found for action ", creep.memory.working, " !!!");
            creep.memory.working = null;
            creep.memory.working_target = null;
        }

    },

    [CONSTS.WORKER_ROLE_HARVESTER]: {
        new: function (base, version) {
            if (!version) {
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

            //var newName = 'WH-' + version + '-' + Game.time.toString().substr(3, 8);
            var newName = 'WH-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_WORKER,
                        role: CONSTS.WORKER_ROLE_HARVESTER,
                        base: base.name,
                        group: 0,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_HARVESTER, ' : ', newName);
            }
        },

        arrange_work: function (creep) { // harvester
            //creep : Creep;
            //var creep = Game.creeps[icreep.name];
            var creep_base = Game.spawns[creep.memory.base];
            //var ret = creep.drop(RESOURCE_ENERGY);
            //console.log(target);

            if (!creep.memory.working) { // 如果没有工作， 则分配工作

                var target = null;

                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没能量， 则去采矿

                    if (creep.memory.harvest_source) { //如果 AI 分配了矿源， 则去采矿
                        target = Game.getObjectById(creep.memory.harvest_source);
                        creep.memory.working = 'harvest';
                        creep.memory.working_target = target.id;
                    } else {
                        // 继续等待AI分配矿源                        
                    }

                }
                else { // 如果手上有能量， 则去存储
                    //creep.memory.working = 'store';
                    var target = null;
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struc) => {
                                return (struc.structureType == STRUCTURE_LINK
                                    || struc.structureType == STRUCTURE_EXTENSION
                                    || struc.structureType == STRUCTURE_SPAWN
                                    || struc.structureType == STRUCTURE_STORAGE
                                    || struc.structureType == STRUCTURE_CONTAINER)
                                    && struc.room.name == creep.memory.working_room
                                    && struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });

                        if (target) {
                            creep.memory.working = 'store';
                            creep.memory.working_target = target.id;
                            //console.log('Checkpoint-90', creep.name, ' : ', target.id);
                        }
                    }
                }

                if (!target) {
                    //console.log("Warning: ", creep.memory.role, " ", creep.name, " is free! returning base!");
                    creep.moveTo(creep_base);
                }
            }// end of if
        },// end of arrange work
    }, // end of role harverster


    [CONSTS.WORKER_ROLE_ENGINEER]: {
        new: function (base, version) {
            if (!version) {
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
            var newName = 'WE-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_WORKER,
                        role: CONSTS.WORKER_ROLE_ENGINEER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_ENGINEER, ' : ', newName);
            }

        },

        arrange_work: function (creep) { //engineer
            //var creep = Game.creeps[icreep.name];

            // var creep_base = Game.spawns[creep.memory.base];
            var working_room = Game.rooms[creep.memory.working_room];

            if (!creep.memory.working) { //如果没有工作，或者工作已经完成， 则分配工作
                var targets = null;
                var target = null;

                if (creep.store.getUsedCapacity() <= 0) { // 如果手上没有能量, 则去找能量
                    // container and storage
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_CONTAINER
                                    || struct.structureType == STRUCTURE_STORAGE)
                                    && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

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

                    // harvest
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                        if (target) {
                            creep.memory.working = 'harvest';
                            creep.memory.working_target = target.id;
                        }
                    }

                } else { // 如果手上有能量

                    // 建造
                    // if (!target) {
                    //     targets = creep_base.room.find(FIND_MY_CONSTRUCTION_SITES);
                    //     if (targets.length > 0) {
                    //         target = targets[0];
                    //         creep.memory.working = 'build';
                    //         creep.memory.working_target = target.id;
                    //     }
                    // }
                    // working_room
                    // 建造
                    if (!target) {
                        targets = working_room.find(FIND_MY_CONSTRUCTION_SITES);
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'build';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // // 补充能量 WT的任务
                    // if (!target) {
                    //     targets = working_room.find(FIND_MY_STRUCTURES, {
                    //         filter: (struct) => {
                    //             return struct.structureType == STRUCTURE_TOWER
                    //                 && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    //         }
                    //     });
                    //     if (targets.length > 0) {
                    //         target = targets[0];
                    //         creep.memory.working = 'refill';
                    //         creep.memory.working_target = target.id;
                    //     }
                    // }

                    // // 优先修自己的建筑 n->1 Tower的任务
                    // if (!target) {
                    //     targets = working_room.find(FIND_MY_STRUCTURES, {
                    //         filter: (struct) => {
                    //             return (struct.hits < struct.hitsMax)
                    //         }
                    //     });
                    //     if (targets.length > 0) {
                    //         target = targets[0];
                    //         creep.memory.working = 'repair';
                    //         creep.memory.working_target = target.id;
                    //     }
                    // }

                    // //修路 1->1 Tower的任务
                    // if (!target) {
                    //     targets = working_room.find(FIND_STRUCTURES, {
                    //         filter: (struct) => {
                    //             return (struct.structureType == STRUCTURE_ROAD
                    //                 && struct.hits < struct.hitsMax)
                    //         }
                    //     });
                    //     if (targets.length > 0) {
                    //         for (var t in targets) {
                    //             var tar = targets[t];

                    //             var counts = _.filter(Game.creeps, (creep) =>
                    //                 creep.memory.role == CONSTS.WORKER_ROLE_ENGINEER
                    //                 && creep.memory.working == 'repair'
                    //                 && creep.memory.working_target == tar.id).length;

                    //             if (counts <= 0) {
                    //                 target = tar;
                    //                 creep.memory.working = 'repair';
                    //                 creep.memory.working_target = target.id;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }

                    // //修墙 1->1 Tower的任务
                    // if (!target) {
                    //     targets = working_room.find(FIND_STRUCTURES, {
                    //         filter: (struct) => {
                    //             return (struct.structureType == STRUCTURE_WALL
                    //                 && struct.hits < struct.hitsMax)
                    //         }
                    //     });
                    //     if (targets.length > 0) {
                    //         for (var t in targets) {
                    //             var tar = targets[t];

                    //             var counts = _.filter(Game.creeps, (creep) =>
                    //                 creep.memory.role == CONSTS.WORKER_ROLE_ENGINEER
                    //                 && creep.memory.working == 'repair'
                    //                 && creep.memory.working_target == tar.id).length;

                    //             if (counts <= 0) {
                    //                 target = tar;
                    //                 creep.memory.working = 'repair';
                    //                 creep.memory.working_target = target.id;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }

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

    [CONSTS.WORKER_ROLE_UPGRADER]: {
        new: function (base, version) {
            if (!version) {
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
            var newName = 'WU-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_WORKER,
                        role: CONSTS.WORKER_ROLE_UPGRADER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_UPGRADER, ' : ', newName);
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
                                return struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (target) {
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }

                    // container and storage
                    if (!target) {
                        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (struct) => {
                                return (struct.structureType == STRUCTURE_CONTAINER
                                    || struct.structureType == STRUCTURE_STORAGE)
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


    [CONSTS.WORKER_ROLE_TRANSFER]: {
        new: function (base, version) {
            if (!version) {
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
                        creepType: CONSTS.CREEP_TYPE_WORKER,
                        role: CONSTS.WORKER_ROLE_TRANSFER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_TRANSFER, ' : ', newName);
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
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    }
                    if (!target) { // 放入消耗点的LINK中
                        targets = creep_base.room.find(FIND_MY_STRUCTURES, {
                            filter: (consumer) => {
                                return consumer.structureType == STRUCTURE_LINK
                                    && Memory.links[consumer.id].role == CONSTS.LINK_ROLE_NORMAL
                                    && consumer.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'refill';
                            creep.memory.working_target = target.id;
                        }
                    }
                }
                else { // 无能量， 则从 Storage > container 中取

                    if (!target) {
                        targets = creep_base.room.find(FIND_MY_STRUCTURES, {
                            filter: (storage) => {
                                return storage.structureType == STRUCTURE_STORAGE
                                    || storage.structureType == STRUCTURE_CONTAINER
                            }
                        });
                        if (targets.length > 0) {
                            target = targets[0];
                            creep.memory.working = 'withdraw';
                            creep.memory.working_target = target.id;
                        }
                    }
                }
            }// end of if
        },//end of arrange work
    }, //end of role transfer


    [CONSTS.WORKER_ROLE_STOREKEEPER]: {
        new: function (base, version) {
            if (!version) {
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
                        creepType: CONSTS.CREEP_TYPE_WORKER,
                        role: CONSTS.WORKER_ROLE_STOREKEEPER,
                        base: base.name,
                        group: 0,
                        working: null,
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', CONSTS.WORKER_ROLE_STOREKEEPER, ' : ', newName);
            }
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
                                && Memory.links[center.id].role == CONSTS.LINK_ROLE_CENTER
                        }
                    });

                    if (targets.length > 0) {
                        target = targets[0];
                        //console.log(target);
                        creep.memory.working = 'withdraw';
                        creep.memory.working_target = target.id;
                    }
                }

            } // end of if
        },//end of arrange work
    }, // end of role storekeeper

} // end of roleWorker

module.exports = roleWorker;
