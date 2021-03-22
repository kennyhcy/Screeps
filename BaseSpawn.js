//BaseSpawn.js
//2021-03-12 14:30

// SPAWN Roles
const SPAWN_ROLE = {
    NORMAL: 'normal',
    MILITARY_FIRST: 'military_first',
    MILITARY_ONLY: 'military_only',
    CIVILIAN_ONLY: 'civilian_only',
}

// creeps:
var roleWorker = require('RoleWorker');
var roleSoldier = require('RoleSoldier');

// Spawn run
var baseSpawn = {
    SPAWN_ROLE: SPAWN_ROLE,

    run: function (base) {
        var role = Memory.spawns[base.name].role;
        this[role].run(base);
    },

    spawn_workers: function (base) {
        // var base = Game.spawns[tbase.name];
        var ret = false;
        //console.log('Workers:',base.name);

        for (let room_name of base.memory.working_rooms) {
            var workerSetting = Memory.rooms[room_name].workerSetting;
            var workerCount = Memory.rooms[room_name].workerCount;
            var level = Memory.rooms[room_name].worker_level;

            for (let role in workerSetting) {
                if (workerCount[role] < workerSetting[role]
                    && !base.spawning) {
                    roleWorker[role].new(base, room_name, level)
                    ret = true;
                    //console.log(role, room_name);
                    //console.log(workerCount[role], ' : ', workerSetting[role]);
                    //workerCount[role] += 1;
                }
            }
        }
        return ret;
    },

    spawn_soldiers: function (base) {
        // var base = Game.spawns[tbase.name];
        var ret = false;
        //console.log('Soldiers:',base.name);

        for (let room_name of base.memory.working_rooms) {
            var soldierSetting = Memory.rooms[room_name].soldierSetting;
            var soldierCount = Memory.rooms[room_name].soldierCount;
            var level = Memory.rooms[room_name].soldier_level;


            for (let role in soldierSetting) {
                if (soldierCount[role] < soldierSetting[role]
                    && !base.spawning) {
                    roleSoldier[role].new(base, room_name, level)
                    ret = true;
                }
            }
        }
        return ret;
    },

    [SPAWN_ROLE.NORMAL]: {
        run: function (base) {
            if (baseSpawn.spawn_workers(base) == false) {
                baseSpawn.spawn_soldiers(base);
            }
        }
    },

    [SPAWN_ROLE.MILITARY_FIRST]: {
        run: function (base) {
            if (baseSpawn.spawn_soldiers(base) == false) {
                baseSpawn.spawn_workers(base);
            }
        }
    },

    [SPAWN_ROLE.MILITARY_ONLY]: {
        run: function (base) {
            baseSpawn.spawn_soldiers(base);
        }
    },

    [SPAWN_ROLE.CIVILIAN_ONLY]: {
        run: function (base) {
            baseSpawn.spawn_workers(base);
        }
    },

}

module.exports = baseSpawn;

