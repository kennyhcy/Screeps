//Sys.js
//2021-03-15

var WORKER_ROLE = require('RoleWorker').WORKER_ROLE;
var SOLDIER_ROLE = require('RoleSoldier').SOLDIER_ROLE;

var sys = {
    initialSettings: function () {
        /*** room settings ***/
        if (!Memory.rooms) {
            Memory.rooms = {}
        }
        for (var r in Game.rooms) {
            // if (Game.rooms[r].controller && Game.rooms[r].controller.my) {
            if (!Memory.rooms[r]) { // 初始化设置
                Memory.rooms[r] = {};
            }

            // resourceSettings
            if (!Memory.rooms[r]['resourceSetting']) {
                Memory.rooms[r]['resourceSetting'] = {};
                var sources = Game.rooms[r].find(FIND_SOURCES);
                for (var s in sources) {
                    var sid = sources[s].id;
                    Memory.rooms[r]['resourceSetting'][sid] = 0; // 各个能量点允许多少creep
                }
                var minerals = Game.rooms[r].find(FIND_MINERALS);
                for (var s in minerals) {
                    var sid = minerals[s].id;
                    Memory.rooms[r]['resourceSetting'][sid] = 0; // 各个矿点允许多少creep
                }
            }

            // Syn. workerSetting
            if (!Memory.rooms[r]['workerSetting']) {
                Memory.rooms[r]['workerSetting'] = {};
                Memory.rooms[r]['worker_level'] = 1;
            }
            var workerSetting = {};
            for (let rr in WORKER_ROLE) {
                let role = WORKER_ROLE[rr];
                workerSetting[role] = Memory.rooms[r]['workerSetting'][role];
                if (!workerSetting[role]) {
                    workerSetting[role] = 0;
                }
            }
            Memory.rooms[r]['workerSetting'] = workerSetting;

            // 同步 soldierSetting
            if (!Memory.rooms[r]['soldierSetting']) {
                Memory.rooms[r]['soldierSetting'] = {};
                Memory.rooms[r]['soldier_level'] = 1;
            }
            var soldierSetting = {};
            for (let rr in SOLDIER_ROLE) {
                let role = SOLDIER_ROLE[rr];
                soldierSetting[role] = Memory.rooms[r]['soldierSetting'][role];
                if (!soldierSetting[role]) {
                    soldierSetting[role] = 0;
                }
            }

            if (!Memory.rooms[r]['terminal']) {
                Memory.rooms[r]['terminal'] = {
                    request: {
                        [RESOURCE_ENERGY]: 0,
                        [RESOURCE_KEANIUM]: 0,
                    },
                    back: {
                        [RESOURCE_ENERGY]: 0,
                        [RESOURCE_KEANIUM]: 0,
                    }
                };
            }

            // 每 tick 把统计清零
            Memory.rooms[r]['workerCount'] = {};
            for (let rr in WORKER_ROLE) {
                let role = WORKER_ROLE[rr];
                Memory.rooms[r]['workerCount'][role] = 0;
            }

            Memory.rooms[r]['soldierCount'] = {};
            for (let rr in SOLDIER_ROLE) {
                let role = SOLDIER_ROLE[rr];
                Memory.rooms[r]['soldierCount'][role] = 0;
            }
            // }
        };

        /*** spawn settings ***/
        if (!Memory.spawns) {
            Memory.spawns = {}
        }
        for (let s in Game.spawns) {
            var spawn = Game.spawns[s];
            if (!spawn.memory) {
                spawn.memory = {};
                spawn.memory['role'] = 'normal';
                spawn.memory['working_rooms'] = [
                    spawn.room.name
                ];
            }
        }

        /*** tower / link settings ***/
        if (!Memory.towers) {
            Memory.towers = {}
        }
        if (!Memory.links) {
            Memory.links = {}
        }
        for (var s in Game.structures) {
            var struct = Game.structures[s];
            // tower settings
            if (struct.structureType == STRUCTURE_TOWER) {
                if (!Memory.towers[s]) {
                    Memory.towers[s] = {};
                    Memory.towers[s].role = 'normal';
                }
            }

            // link settings
            if (struct.structureType == STRUCTURE_LINK) {
                if (!Memory.links[s]) {
                    Memory.links[s] = {};
                    Memory.links[s].role = 'normal';
                }
            }
        }
        //console.log(Game.time, ' Mod100 : ', Game.time % 100);
        if (Game.time % 100 == 0) {
            console.log('Bucket:', Game.cpu.bucket)
        }
        if (Game.cpu.bucket >= 10000) {
            var ret = Game.cpu.generatePixel();
            console.log('generatePixel : ', ret);
        }
    },

    cleansing: function () {
        /*** Cleansing ***/
        for (var name in Memory.creeps) { //cleasing
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                //console.log('Clearing non-existing creep memory:', name);
            }
        };

        for (var f in Memory.flags) { //cleasing
            if (!Game.flags[f]) {
                delete Memory.flags[f];
                //console.log('Clearing non-existing flag memory:', f);
            }
        };

        for (var s in Memory.spawns) {
            if (!Game.spawns[s]) {
                delete Memory.spawns[s];
            }
        };

        for (var t in Memory.towers) {
            if (!Game.structures[t]) {
                delete Memory.towers[t];
            }
        };
    },

    arrange_harvester: function () {
        // 每个资源点有几个creep
        var current = {};
        for (var r in Game.rooms) {
            var room = Game.rooms[r];

            var sources = room.find(FIND_SOURCES);
            for (var s in sources) {
                var source = sources[s];
                current[source.id] = 0;
            }
            var minerals = room.find(FIND_MINERALS);
            for (var s in minerals) {
                var source = minerals[s];
                current[source.id] = 0;
            }

        }

        for (var c in Game.creeps) {
            var creep = Game.creeps[c];
            if (creep.memory.harvest_source) {
                current[creep.memory.harvest_source] += 1;
            }
        }

        //Memory.test = current;
        //delete Memory.test;

        // 每个资源点最多该有几个creep
        var settings = {};
        for (var r in Game.rooms) {
            var room = Game.rooms[r];
            var resourceSetting = Memory.rooms[r].resourceSetting;
            for (var r in resourceSetting) {
                settings[r] = resourceSetting[r];
            }
        }

        // 调整
        for (var c in current) {
            var curr = current[c];
            if (!curr) { curr = 0; }

            var sett = settings[c];
            if (!sett) { sett = 0; }

            // console.log(c, ':', curr, ' : ', sett)

            if (curr > sett) { // 资源点creep数量多于设置的， 找一个清空目标点， 反正多次循环嘛 

                var tcreeps = _.filter(Game.creeps, (creep) =>
                    creep.memory.role == WORKER_ROLE.HARVESTER
                    && creep.memory.harvest_source == c
                );

                if (tcreeps.length > 0) {
                    // tcreeps[0].memory.harvest_source = undefined;
                    tcreeps[0].memory.harvest_source = null;
                    tcreeps[0].memory.working = null;
                    tcreeps[0].memory.working_target = null;
                }
            }

            //console.log(c, sett, ' : ', curr)

            if (sett > curr) { // 资源点creep小于设置的， 找空目标的creep分配过来, 一个就行， 反正要循环嘛

                var source_room = Game.getObjectById(c).room;

                //console.log(source_room.name);

                var tcreeps = _.filter(Game.creeps, (creep) =>
                    creep.memory.role == WORKER_ROLE.HARVESTER
                    && !creep.memory.harvest_source
                    && creep.memory.working_room == source_room.name
                );

                if (tcreeps.length > 0) {
                    tcreeps[0].memory.harvest_source = c;
                }
            }
        }

        // 剩下的creep目标点为空的，就空着吧， creep无任务时加提示

    },

    userCommand: function () {
        //console.log(Game.time);
        var comm;
        if (!Memory.ucomm) {
            Memory.ucomm = '';
        } else {
            comm = Memory.ucomm;
            Memory.ucomm = '';
        }

        if (comm == 'clear flag') {
            for (var i in Game.flags) {
                mflag = Game.flags[i];
                mflag.remove();
            }
            console.log(comm, ' ---> OK');
        } else if (comm == 'reset group') {
            for (var i in Game.creeps) {
                mcreep = Game.creeps[i];
                if (mcreep.memory.creeptype == 'soldier') {
                    mcreep.memory.group1 = COLOR_RED;
                }
            }
            console.log(comm, ' ---> OK');
        } else if (comm == 'energy') {
            for (var r in Game.rooms) {
                console.log(Game.rooms[r].name, ' : ', Game.rooms[r].energyAvailable,
                    ' / ', Game.rooms[r].energyCapacityAvailable);

            }
        }
    },

    arrange_worker: function () {
        // for (var r in Game.rooms) {
        //     var room = Game.rooms[r];

        //     if (!room.memory.enemy_queue) {
        //         // room.memory.enemy_queue = [];
        //     } else {
        //         // delete room.memory.enemy_queue;
        //     }

        //     var targets = room.find(FIND_HOSTILE_POWER_CREEPS);
        //     if (targets.length > 0) {
        //         for (var t in targets) {
        //             const element = array[index];

        //         }
        //     }


        //     var targets = room.find(FIND_HOSTILE_CREEPS);

        // }
    },



    arrange_soldier: function () {

    },



}

module.exports = sys;
