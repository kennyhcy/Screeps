// RoleSoldier
// 2021-03-12 16:40


var CONSTS = require('Sys').CONSTS;
var roleSoldier = {
    run: function (creep) {
        this.arrange_work(creep);
        this.execute_work(creep);
        if (!creep.memory.working) {
            this.arrange_work(creep);
            this.execute_work(creep);
        }
    },
    arrange_work(creep) {
        var target = null;
        var secGroup = {
            [CONSTS.SOLDIER_ROLE_TANK]: COLOR_PURPLE, // 2,
            [CONSTS.SOLDIER_ROLE_COMMANDO]: COLOR_BLUE,// 3,
            [CONSTS.SOLDIER_ROLE_SHOOTER]: COLOR_CYAN, //4,
            [CONSTS.SOLDIER_ROLE_ARTILLERY]: COLOR_GREEN, //5,
            [CONSTS.SOLDIER_ROLE_SAPPER]: COLOR_YELLOW, //6,
            [CONSTS.SOLDIER_ROLE_CLAIMER]: COLOR_ORANGE, //7,
            [CONSTS.SOLDIER_ROLE_MEDIC]: COLOR_BROWN, //8,
        };

        if (!target) {
            // target = creep.pos.findClosestByRange(FIND_FLAGS, {
            //     filter: (flag) => {
            //         return flag.color == creep.memory.group
            //     }
            // });
            if (!target) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == secGroup[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    target = flags[0];
                }
            }

            if (!target) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    target = flags[0];
                }
            }

            // if (target && !creep.memory.working && creep.pos.inRangeTo(target, 3)) {
            //     creep.memory.working = 'defend_pos';
            //     creep.memory.working_target = target.name;
            // } else 
            if (target && target.secondaryColor != COLOR_WHITE) {
                creep.memory.working = 'attack_area';
                creep.memory.working_target = target.name;
            }
            else if (target && target.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = target.name;
            }
            else if (!target) {
                creep.memory.working = 'defend_room';
                creep.memory.working_target = creep.room.name;
            }
        }
    },
    execute_work(creep) {
        switch (creep.memory.working) {
            case 'move_pos':
                // var flag = Game.getObjectById(creep.memory.working_target);
                var flag = Game.flags[creep.memory.working_target];
                if (flag) {
                    var ret = creep.moveTo(flag);
                    if (ret != 0) {
                        creep.memory.working = null;
                        creep.memory.working_target = null;
                    }
                }
                break;

            case 'attack_area':
                var targets = [];
                //var flag = Game.getObjectById(creep.memory.working_target);
                var flag = Game.flags[creep.memory.working_target];
                if (flag) {
                    var ret = creep.moveTo(flag);
                    if (ret != 0) {
                        creep.memory.working = null;
                        creep.memory.working_target = null;
                    }

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_COMMANDO) {
                        var target = null;
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }

                        if (target) {
                            creep.attack(target);
                        }
                    }

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_SHOOTER) {
                        var target = null;
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (target) {
                            creep.rangedAttack(target);
                        }
                    }

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_ARTILLERY) {
                        var target = null;
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (target) {
                            creep.rangedMassAttack();
                        }
                    }

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_SAPPER) {
                        var target = null;
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                                filter: (struc) => {
                                    return struc.structureType == STRUCTURE_WALL
                                        && (!struc.room.controller
                                            || (struc.room.controller && struc.room.controller.my == false))
                                }
                            });
                            if (targets.length > 0) {
                                target = targets[0];
                            }
                        }
                        if (target) {
                            creep.dismantle(target);
                        }
                    };

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_MEDIC) {
                        var target = null;
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                                filter: (homie) => {
                                    return homie.hits < homie.hitsMax
                                }
                            });
                            if (targets.length > 0) {
                                target = targets[0];
                                creep.heal(target)
                            }
                        }
                        if (!target) {
                            var targets = creep.pos.findInRange(FIND_MY_CREEPS, 3, {
                                filter: (homie) => {
                                    return homie.hits < homie.hitsMax
                                }
                            });
                            if (targets.length > 0) {
                                target = targets[0];
                                creep.rangedHeal(target)
                            }
                        }
                    };

                    if (creep.memory.role == CONSTS.SOLDIER_ROLE_CLAIMER) {
                        var target;
                        var ret = -99;
                        if (flag.room) {
                            var target = flag.room.controller;
                        }
                        if (target && creep.pos.inRangeTo(target, 3)) {
                            creep.moveTo(target);
                            // claimer_action
                            if (ret != 0 && creep.claimer_action == 'claim') {
                                ret = creep.claimController(target);
                                //console.log('claimController:', ret);
                            }
                            if (ret != 0 && creep.claimer_action == 'attack') {
                                ret = creep.attackController(target);
                                //console.log('attackController:', ret);
                            }
                            if (ret != 0 && creep.claimer_action == 'reserve') {
                                ret = creep.reserveController(target);
                                //console.log('reserveController:', ret);
                            }
                            if (ret != 0 && creep.claimer_action == 'sign') {
                                ret = creep.signController(target, creep.memory.claimer_sign_text);
                                creep.say(creep.memory.claimer_sign_text);
                                creep.claimer_action == null;
                            }
                        }
                    };

                }
                break;

            // case 'defend_pos':
            //     var targets = [];
            //     // var flag = Game.getObjectById(creep.memory.working_target);
            //     var flag = Game.flags[creep.memory.working_target];
            //     if (flag && creep.pos.inRangeTo(flag, 3)) {

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_COMMANDO) {
            //             var target = null;
            //             if (!target) {
            //                 var targets = flag.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (!target) {
            //                 var targets = flag.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }

            //             if (target) {
            //                 creep.moveTo(target);
            //                 creep.attack(target);
            //             }
            //         }

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_SHOOTER) {
            //             var target = null;
            //             if (!target) {
            //                 var targets = flag.pos.findInRange(FIND_HOSTILE_CREEPS, 6);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (!target) {
            //                 var targets = flag.pos.findInRange(FIND_HOSTILE_STRUCTURES, 6);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (target) {
            //                 if (!creep.pos.inRangeTo(target, 3)) {
            //                     creep.moveTo(target);
            //                 }
            //                 creep.rangedAttack(target);
            //             }
            //         }

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_ARTILLERY) {
            //             var target = null;
            //             if (!target) {
            //                 var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 6);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (!target) {
            //                 var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 6);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (target) {
            //                 if (!creep.pos.inRangeTo(target, 3)) {
            //                     creep.moveTo(target);
            //                 }
            //                 creep.rangedMassAttack();
            //             }
            //         }

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_SAPPER) {
            //             var target = null;
            //             if (!target) {
            //                 var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (!target) {
            //                 var targets = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            //                     filter: (struc) => {
            //                         return struc.structureType == STRUCTURE_WALL
            //                             && (!struc.room.controller
            //                                 || (struc.room.controller && struc.room.controller.my() == false))
            //                     }
            //                 });
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                 }
            //             }
            //             if (target) {
            //                 creep.moveTo(target);
            //                 creep.dismantle(target);
            //             }
            //         }

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_MEDIC) {
            //             var target = null;
            //             if (!target) {
            //                 var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
            //                     filter: (homie) => {
            //                         return homie.hits < homie.hitsMax
            //                     }
            //                 });
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                     creep.heal(target)
            //                 }
            //             }
            //             if (!target) {
            //                 var targets = flag.pos.findInRange(FIND_MY_CREEPS, 6, {
            //                     filter: (homie) => {
            //                         return homie.hits < homie.hitsMax
            //                     }
            //                 });
            //                 if (targets.length > 0) {
            //                     target = targets[0];
            //                     if (!creep.pos.inRangeTo(target, 3)) {
            //                         creep.moveTo(target);
            //                     }
            //                     creep.rangedHeal(target)
            //                 }
            //             }
            //         };

            //         if (creep.memory.role == CONSTS.SOLDIER_ROLE_CLAIMER) {
            //             var target;
            //             if (!target) {
            //                 var target = flag.room.controller;
            //                 if (target && creep.pos.inRangeTo(target, 3)) {
            //                     creep.moveTo(target);
            //                     var ret = creep.claimController(target);
            //                     if (ret != 0) {
            //                         var ret = creep.attackController(target);
            //                     }
            //                 }
            //             }
            //         };
            //     }
            //     else {
            //         creep.memory.working = null;
            //         creep.memory.working_target = null;
            //     }
            //     break;

            case 'defend_room':
                var targets = [];
                //var flag = Game.getObjectById(creep.memory.working_target);
                //var flag = creep.pos.room.controller;
                var flag;
                if (!flag) {
                    flag = creep;
                }
                if (creep.memory.role == CONSTS.SOLDIER_ROLE_COMMANDO) {
                    var target = null;
                    if (!target) {
                        var target = flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    }
                    if (!target) {
                        var target = flag.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if (target) {
                        creep.moveTo(target);
                        creep.attack(target);
                    }
                }

                if (creep.memory.role == CONSTS.SOLDIER_ROLE_SHOOTER) {
                    var target = null;
                    if (!target) {
                        var target = flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    }
                    if (!target) {
                        var target = flag.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if (target) {
                        if (!creep.pos.inRangeTo(target, 3)) {
                            creep.moveTo(target);
                        }
                        creep.rangedAttack(target);
                    }
                }

                if (creep.memory.role == CONSTS.SOLDIER_ROLE_ARTILLERY) {
                    var target = null;
                    if (!target) {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    }
                    if (!target) {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if (target) {
                        if (!creep.pos.inRangeTo(target, 3)) {
                            creep.moveTo(target);
                        }
                        creep.rangedMassAttack();
                    }
                };

                if (creep.memory.role == CONSTS.SOLDIER_ROLE_SAPPER) {
                    var target = null;
                    if (!target) {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if (!target) {
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (struc) => {
                                return struc.structureType == STRUCTURE_WALL
                                    && (!struc.room.controller
                                        || (struc.room.controller && struc.room.controller.my == false))
                            }
                        });
                    }
                    if (target) {
                        creep.moveTo(target);
                        creep.dismantle(target);
                    }
                };

                if (creep.memory.role == CONSTS.SOLDIER_ROLE_MEDIC) {
                    var target = null;
                    if (!target) {
                        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (homie) => {
                                return homie.hits < homie.hitsMax
                            }
                        });
                    }
                    if (target) {
                        if (creep, pos.inRangeTo(target, 1)) {
                            creep.heal(target);
                        }
                        else {
                            if (!creep.pos.inRangeTo(target, 3)) {
                                creep.moveTo(target);
                            }
                            creep.rangedHeal(target);
                        }
                    }
                };

                // if (creep.memory.role == CONSTS.SOLDIER_ROLE_CLAIMER) {
                //     var target;
                //     if (!target) {
                //         var target = flag.room.controller;
                //         if (target && creep.pos.inRangeTo(target, 3)) {
                //             creep.moveTo(target);
                //             var ret = creep.claimController(target);
                //             if (ret != 0) {
                //                 //console.log('claimController: ', ret);
                //                 var ret = creep.attackController(target);
                //             }
                //         }
                //     }
                // };
                if (creep.memory.role == CONSTS.SOLDIER_ROLE_CLAIMER) {
                    var ret = -99;
                    var target = creep.room.controller;

                    // claimer_action
                    if (ret != 0 && creep.memory.claimer_action == 'claim') {
                        creep.moveTo(target);
                        ret = creep.claimController(target);
                        //console.log('claimController:', ret);
                    }
                    if (ret != 0 && creep.memory.claimer_action == 'attack') {
                        creep.moveTo(target);
                        ret = creep.attackController(target);
                        //console.log('attackController:', ret);
                    }
                    if (ret != 0 && creep.memory.claimer_action == 'reserve') {
                        creep.moveTo(target);
                        ret = creep.reserveController(target);
                        //console.log('reserveController:', ret);
                    }
                    if (ret != 0 && creep.memory.claimer_action == 'sign') {
                        creep.moveTo(target);
                        ret = creep.signController(target, creep.memory.claimer_sign_text);
                        if (ret == 0) {
                            creep.say(creep.memory.claimer_sign_text);
                            creep.memory.claimer_action == null;
                        }
                    }
                };
                break;

            default:
                creep.memory.working = null;
                creep.memory.working_target = null;
                console.log(creep.name, ' No work!');
                break;
        }
    },

    [CONSTS.SOLDIER_ROLE_TANK]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [TOUGH, MOVE];
                    break;
                case 2:
                    parts = [TOUGH, TOUGH, MOVE, MOVE];
                    break;
                case 3:
                    parts = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [TOUGH, MOVE];
            }

            var newName = 'ST-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_TANK,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_COMMANDO]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [ATTACK, MOVE];
                    break;
                case 2:
                    parts = [ATTACK, ATTACK, MOVE, MOVE];
                    break;
                case 3:
                    parts = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [ATTACK, MOVE];
            }

            var newName = 'SC-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_COMMANDO,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_SHOOTER]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [RANGED_ATTACK, MOVE];
                    break;
                case 2:
                    parts = [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
                    break;
                case 3:
                    parts = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [RANGED_ATTACK, MOVE];
            }

            var newName = 'SS-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_SHOOTER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_ARTILLERY]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [RANGED_ATTACK, MOVE];
                    break;
                case 2:
                    parts = [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
                    break;
                case 3:
                    parts = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [RANGED_ATTACK, MOVE];
            }

            var newName = 'SA-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_ARTILLERY,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_SAPPER]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [WORK, MOVE];
                    break;
                case 2:
                    parts = [WORK, WORK, MOVE, MOVE];
                    break;
                case 3:
                    parts = [WORK, WORK, WORK, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [WORK, MOVE];
            }

            var newName = 'SP-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_SAPPER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_MEDIC]:
    {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [HEAL, MOVE];
                    break;
                case 2:
                    parts = [HEAL, HEAL, MOVE, MOVE];
                    break;
                case 3:
                    parts = [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [HEAL, MOVE];
            }

            var newName = 'SM-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_MEDIC,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

    },

    [CONSTS.SOLDIER_ROLE_CLAIMER]: {
        new: function (base, version) {
            var parts = [];
            switch (version) {
                case 1:
                    parts = [CLAIM, MOVE];
                    break;
                case 2:
                    parts = [CLAIM, CLAIM, MOVE, MOVE];
                    break;
                case 3:
                    parts = [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE,];
                    break;
                default:
                    version = 1;
                    parts = [CLAIM, MOVE];
            }

            var newName = 'SCLM-' + version + '-' + Game.time;
            var retCreep = base.spawnCreep(parts, newName,
                {
                    memory:
                    {
                        creepType: CONSTS.CREEP_TYPE_SOLDIER,
                        role: CONSTS.SOLDIER_ROLE_CLAIMER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        working_room: base.room.name,
                        claimer_action: 'attack', //'reserve', 'claim' , 'sign'
                        claimer_sign_text: 'Peace!',
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },
    },


}


module.exports = roleSoldier;
