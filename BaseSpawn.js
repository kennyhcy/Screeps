//BaseSpawn.js
//2021-03-12 14:30
var CONSTS = require('Sys').CONSTS;

// creeps:
var roleWorker = require('RoleWorker');
var roleSoldier = require('RoleSoldier');

// Spawn run
var baseSpawn = {
    run: function (base) {
        var role = Memory.spawns[base.name].role;
        this[role].run(base);
    },

    spawn_workers: function (base) {
        var level = base.memory.worker_level;
        var ret = true;
        // ************* Workers ************* //
        // WORKER_ROLE_HARVESTER: 'harvester',
        // WORKER_ROLE_ENGINEER: 'engineer',
        // WORKER_ROLE_UPGRADER: 'upgrader',
        // WORKER_ROLE_TRANSFER: 'transfer',
        // WORKER_ROLE_STOREKEEPER: 'storekeeper',
        var counts_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.WORKER_ROLE_HARVESTER && creep.memory.base == base.name).length;
        var counts_engineer = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.WORKER_ROLE_ENGINEER && creep.memory.base == base.name).length;
        var counts_upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.WORKER_ROLE_UPGRADER && creep.memory.base == base.name).length;
        var counts_transfer = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.WORKER_ROLE_TRANSFER && creep.memory.base == base.name).length;
        var counts_storekeeper = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.WORKER_ROLE_STOREKEEPER && creep.memory.base == base.name).length;
        var counts_repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.base == base.name).length;

        var workerSetting = Memory.spawns[base.name].workerSetting;

        if (false) { }
        else if (counts_harvester < workerSetting[CONSTS.WORKER_ROLE_HARVESTER]) { roleWorker[CONSTS.WORKER_ROLE_HARVESTER].new(base, level); }
        else if (counts_engineer < workerSetting[CONSTS.WORKER_ROLE_ENGINEER]) { roleWorker[CONSTS.WORKER_ROLE_ENGINEER].new(base, level); }
        else if (counts_upgrader < workerSetting[CONSTS.WORKER_ROLE_UPGRADER]) { roleWorker[CONSTS.WORKER_ROLE_UPGRADER].new(base, level); }
        else if (counts_transfer < workerSetting[CONSTS.WORKER_ROLE_TRANSFER]) { roleWorker[CONSTS.WORKER_ROLE_TRANSFER].new(base, level); }
        else if (counts_storekeeper < workerSetting[CONSTS.WORKER_ROLE_STOREKEEPER]) { roleWorker[CONSTS.WORKER_ROLE_STOREKEEPER].new(base, level); }
        else if (counts_repairer < workerSetting['repairer']) { roleWorker.repairer.new(base, level); }
        else { ret = false; }

        return ret;
    },

    spawn_soldiers: function (base) {
        var level = base.memory.soldier_level;
        var ret = true;
        // ************* Soldiers ************* //
        // SOLDIER_ROLE_TANK: 'tank',
        // SOLDIER_ROLE_COMMANDO: 'commando',
        // SOLDIER_ROLE_SHOOTER: 'shooter',
        // SOLDIER_ROLE_ARTILLERY: 'artillery',
        // SOLDIER_ROLE_SAPPER: 'sapper',
        // SOLDIER_ROLE_MEDIC: 'medic',
        var counts_tank = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_TANK && creep.memory.base == base.name).length;
        var counts_commando = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_COMMANDO && creep.memory.base == base.name).length;
        var counts_shooter = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_SHOOTER && creep.memory.base == base.name).length;
        var counts_artillery = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_ARTILLERY && creep.memory.base == base.name).length;
        var counts_sapper = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_SAPPER && creep.memory.base == base.name).length;
        var counts_medic = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_MEDIC && creep.memory.base == base.name).length;
        var counts_claimer = _.filter(Game.creeps, (creep) => creep.memory.role == CONSTS.SOLDIER_ROLE_CLAIMER && creep.memory.base == base.name).length;

        var soldierSetting = Memory.spawns[base.name].soldierSetting;

        if (false) { }
        else if (counts_tank < soldierSetting[CONSTS.SOLDIER_ROLE_TANK]) { roleSoldier[CONSTS.SOLDIER_ROLE_TANK].new(base, level); }
        else if (counts_commando < soldierSetting[CONSTS.SOLDIER_ROLE_COMMANDO]) { roleSoldier[CONSTS.SOLDIER_ROLE_COMMANDO].new(base, level); }
        else if (counts_shooter < soldierSetting[CONSTS.SOLDIER_ROLE_SHOOTER]) { roleSoldier[CONSTS.SOLDIER_ROLE_SHOOTER].new(base, level); }
        else if (counts_artillery < soldierSetting[CONSTS.SOLDIER_ROLE_ARTILLERY]) { roleSoldier[CONSTS.SOLDIER_ROLE_ARTILLERY].new(base, level); }
        else if (counts_sapper < soldierSetting[CONSTS.SOLDIER_ROLE_SAPPER]) { roleSoldier[CONSTS.SOLDIER_ROLE_SAPPER].new(base, level); }
        else if (counts_medic < soldierSetting[CONSTS.SOLDIER_ROLE_MEDIC]) { roleSoldier[CONSTS.SOLDIER_ROLE_MEDIC].new(base, level); }
        else if (counts_claimer < soldierSetting[CONSTS.SOLDIER_ROLE_CLAIMER]) { roleSoldier[CONSTS.SOLDIER_ROLE_CLAIMER].new(base, level); }
        else { ret = false; }

        return ret;
    },


    [CONSTS.SPAWN_ROLE_NORMAL]: {
        run: function (base) {
            if (baseSpawn.spawn_workers(base) == false) {
                baseSpawn.spawn_soldiers(base);
            }
        }
    },

    [CONSTS.SPAWN_ROLE_MILITARY_FIRST]: {
        run: function (base) {
            if (baseSpawn.spawn_soldiers(base) == false) {
                baseSpawn.spawn_workers(base);
            }
        }
    },

    [CONSTS.SPAWN_ROLE_MILITARY_ONLY]: {
        run: function (base) {
            baseSpawn.spawn_soldiers(base);
        }
    },

    [CONSTS.SPAWN_ROLE_CIVILIAN_ONLY]: {
        run: function (base) {
            baseSpawn.spawn_workers(base);
        }
    },

}

module.exports = baseSpawn;

