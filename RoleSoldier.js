// RoleSoldier
// 2021-03-16

var fight = require('ActionFight');

const CREEP_TYPE = {
    WORKER: 'worker',
    SOLDIER: 'soldier',
}

const SOLDIER_ROLE = {
    TANK: 'tank',
    COMMANDO: 'commando',
    SHOOTER: 'shooter',
    ARTILLERY: 'artillery',
    SAPPER: 'sapper',
    CLAIMER: 'claimer',
    MEDIC: 'medic',
}

const SECGROUP = {
    [SOLDIER_ROLE.TANK]: COLOR_PURPLE,     //2,
    [SOLDIER_ROLE.COMMANDO]: COLOR_BLUE,   //3,
    [SOLDIER_ROLE.SHOOTER]: COLOR_CYAN,    //4,
    [SOLDIER_ROLE.ARTILLERY]: COLOR_GREEN, //5,
    [SOLDIER_ROLE.SAPPER]: COLOR_YELLOW,   //6,
    [SOLDIER_ROLE.CLAIMER]: COLOR_ORANGE,  //7,
    [SOLDIER_ROLE.MEDIC]: COLOR_BROWN,     //8,
};

var roleSoldier = {
    run: function (creep) {
        this[creep.memory.role].arrange_work(creep);
        if (creep.memory.working) {
            fight[creep.memory.working](creep);
        }

        if (!creep.memory.working) {
            this[creep.memory.role].arrange_work(creep); // 跑两遍 不发呆
            if (creep.memory.working) {
                fight[creep.memory.working](creep);
            }
        }

    },

    [SOLDIER_ROLE.TANK]:
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
                case 4: // cose = 1200
                    parts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.TANK,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'attack_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'attack_room';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.COMMANDO]:
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.COMMANDO,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'attack_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'attack_room';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.SHOOTER]:
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.SHOOTER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'rangedattack_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'rangedattack_room';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.ARTILLERY]:
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.ARTILLERY,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },


        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'massattack_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'massattack_room';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.SAPPER]:
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.SAPPER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'dismantle_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'dismantle_room';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.MEDIC]:
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.MEDIC,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log('SUCCESS: Spawning new ', Game.creeps[newName].memory.role, ' : ', newName);
            }
        },

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'heal_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'heal_area';
                creep.memory.working_target = null;
            }
        },

    },

    [SOLDIER_ROLE.CLAIMER]: {
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
                    parts = [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE];
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
                        creepType: CREEP_TYPE.SOLDIER,
                        role: SOLDIER_ROLE.CLAIMER,
                        base: base.name,
                        group: 1,
                        working: '',
                        working_target: null,
                        harvest_source: null,
                        base_room: base.room.name,
                        working_room: base.room.name,
                        claimer_action: 'sign', //'reserve', 'claim' , 'sign'
                        claimer_sign_text: 'Peace & Love!',
                    }
                });

            //console.log('Spawning new harvester: ' + newCreep);
            if (retCreep == 0) {
                console.log(base.name, ' SUCCESS: Spawning new ', SOLDIER_ROLE.CLAIMER, ' : ', newName);
            }
        }, //new

        arrange_work: function (creep) {
            var flag = null;
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == SECGROUP[creep.memory.role]
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (!flag) {
                var flags = _.filter(Game.flags,
                    (flag) => {
                        return flag.color == creep.memory.group
                            && flag.secondaryColor == COLOR_RED
                    }
                );
                if (flags.length > 0) {
                    flag = flags[0];
                }
            }
            if (flag && flag.secondaryColor == COLOR_WHITE) {
                creep.memory.working = 'move_pos';
                creep.memory.working_target = flag.name;
            }
            else if (flag) {
                creep.memory.working = 'claim_area';
                creep.memory.working_target = flag.name;
            }
            else {
                creep.memory.working = 'claim_room';
                creep.memory.working_target = null;
            }
        }, //arrange_work 

    },


}


module.exports = roleSoldier;
