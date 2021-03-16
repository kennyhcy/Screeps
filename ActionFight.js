var fight = {
    move_pos: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
            if (ret != 0) {
                creep.memory.working = null;
                creep.memory.working_target = null;
            }
        }
    },

    attack_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
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
    },

    attack_room: function (creep) {
        //var working_room = Game.rooms[creep.memory.working_room];
        var working_room = creep.room;
        if (working_room) {
            var target = null;
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_CREEPS);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (target) {
                var ret = creep.attack(target);
                if (ret != 0) {
                    creep.moveTo(target);
                }
            }
        }
    },

    rangedattack_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
        }
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
    },

    rangedattack_room: function (creep) {
        // var working_room = Game.rooms[creep.memory.working_room];
        var working_room = creep.room;
        if (working_room) {
            var target = null;
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_CREEPS);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (target) {
                var ret = creep.rangedAttack(target);
                if (ret != 0) {
                    creep.moveTo(target);
                }
            }
        }
    },

    massattack_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
        }
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
    },

    massattack_room: function (creep) {
        // var working_room = Game.rooms[creep.memory.working_room];
        var working_room = creep.room;
        if (working_room) {
            var target = null;
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_CREEPS);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (target) {
                if (creep.pos.inRangeTo(target, 3)) {
                    creep.rangedMassAttack();
                } else {
                    creep.moveTo(target);
                }
            }
        }
    },

    dismantle_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
        }
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
    },

    dismantle_room: function (creep) {
        // var working_room = Game.rooms[creep.memory.working_room];
        var working_room = creep.room;
        if (working_room) {
            var target = null;
            if (!target) {
                var targets = working_room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    target = targets[0];
                }
            }
            if (!target) {
                var targets = working_room.find(FIND_STRUCTURES, {
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
                var ret = creep.dismantle(target);
                if (ret != 0) {
                    creep.moveTo(target);
                }
            }
        }
    },

    heal_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
        }
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
    },

    heal_room: function (creep) {
        var working_room = creep.room;
        var target = null;
        if (!target) {
            var targets = working_room.find(FIND_MY_CREEPS, {
                filter: (homie) => {
                    return homie.hits < homie.hitsMax
                }
            });
            if (targets.length > 0) {
                target = targets[0];
            }
        }
        if (target) {
            var ret = creep.heal(target);
            if (ret != 0) {
                var ret = creep.rangedHeal(target);
            }

            if (ret != 0) {
                creep.moveTo(target);
            }
        }
    },

    claim_area: function (creep) {
        var flag = Game.flags[creep.memory.working_target];
        if (flag) {
            var ret = creep.moveTo(flag);
        }
        var target;
        var ret = -99;
        if (flag.room) {
            var target = flag.room.controller;
        }
        if (target && creep.pos.inRangeTo(target, 3)) {
            creep.moveTo(target);
            // claimer_action
            if (ret != 0 && creep.memory.claimer_action == 'claim') {
                ret = creep.claimController(target);
                //console.log('claimController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'attack') {
                ret = creep.attackController(target);
                //console.log('attackController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'reserve') {
                ret = creep.reserveController(target);
                //console.log('reserveController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'sign') {
                ret = creep.signController(target, creep.memory.claimer_sign_text);
                creep.say(creep.memory.claimer_sign_text);
                creep.memory.claimer_action == null;
            }
        }
    },

    claim_room: function (creep) {
        var working_room = creep.room;
        var target = working_room.controller;
        var ret = -99;

        if (target) {
            creep.moveTo(target);
            // claimer_action
            if (ret != 0 && creep.memory.claimer_action == 'claim') {
                ret = creep.claimController(target);
                //console.log('claimController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'attack') {
                ret = creep.attackController(target);
                //console.log('attackController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'reserve') {
                ret = creep.reserveController(target);
                //console.log('reserveController:', ret);
            }
            if (ret != 0 && creep.memory.claimer_action == 'sign') {
                ret = creep.signController(target, creep.memory.claimer_sign_text);
                creep.say(creep.memory.claimer_sign_text);
                creep.memory.claimer_action == null;
            }
        }
    },

}
module.exports = fight;