//Sys.js
//2021-03-12 14:30 

var sys = {

    CONSTS: {
        //Creep Types:
        CREEP_TYPE_WORKER: 'worker',
        CREEP_TYPE_SOLDIER: 'soldier',

        //Creep Roles:
        WORKER_ROLE_HARVESTER: 'harvester',
        WORKER_ROLE_ENGINEER: 'engineer',
        WORKER_ROLE_UPGRADER: 'upgrader',
        WORKER_ROLE_TRANSFER: 'transfer',
        WORKER_ROLE_STOREKEEPER: 'storekeeper',

        SOLDIER_ROLE_TANK: 'tank',
        SOLDIER_ROLE_COMMANDO: 'commando',
        SOLDIER_ROLE_SHOOTER: 'shooter',
        SOLDIER_ROLE_ARTILLERY: 'artillery',
        SOLDIER_ROLE_SAPPER: 'sapper',
        SOLDIER_ROLE_CLAIMER: 'claimer',
        SOLDIER_ROLE_MEDIC: 'medic',

        // Spawn roles:
        SPAWN_ROLE_NORMAL: 'normal',
        SPAWN_ROLE_MILITARY_FIRST: 'military_first',
        SPAWN_ROLE_MILITARY_ONLY: 'military_only',
        SPAWN_ROLE_CIVILIAN_ONLY: 'civilian_only',

        // Tower roles:
        TOWER_ROLE_NORMAL: 'normal',
        TOWER_ROLE_MILITARY_ONLY: 'military_only',
        TOWER_ROLE_CIVILIAN_ONLY: 'civilian_only',

        // link roles:
        LINK_ROLE_NORMAL: 'normal', // consumer site
        LINK_ROLE_HARVEST_SITE: 'harvest_site',
        LINK_ROLE_CENTER: 'center',

    },


    run: function () {
        this._initialSettings();
        this._cleansing();
        this._update_memory();
        this._arrange_harvester();
        this._userCommand();
    },


    _initialSettings: function () {
        /*** room settings ***/
        if (!Memory.rooms) {
            Memory.rooms = {}
        }
        for (var r in Game.rooms) {
            if (Game.rooms[r].controller.my) {
                if (!Memory.rooms[r]) { // 初始化设置
                    Memory.rooms[r] = {};
                    Memory.rooms[r]['resourceSetting'] = {};
                    var sources = Game.rooms[r].find(FIND_SOURCES);
                    for (var s in sources) {
                        var sid = sources[s].id;
                        Memory.rooms[r]['resourceSetting'][sid] = 0; // 各个能量点允许多少creep
                    }
                }
            }
        };
        /*** spawn settings ***/
        if (!Memory.spawns) {
            Memory.spawns = {}
        }
        for (var s in Game.spawns) {
            if (!Memory.spawns[s]) {
                Memory.spawns[s] = {};
                Memory.spawns[s]['workerSetting'] = {
                    [this.CONSTS.WORKER_ROLE_HARVESTER]: 0,
                    [this.CONSTS.WORKER_ROLE_ENGINEER]: 0,
                    [this.CONSTS.WORKER_ROLE_UPGRADER]: 0,
                    [this.CONSTS.WORKER_ROLE_TRANSFER]: 0,
                    [this.CONSTS.WORKER_ROLE_STOREKEEPER]: 0,
                };
                Memory.spawns[s]['soldierSetting'] = {
                    [this.CONSTS.SOLDIER_ROLE_TANK]: 0,
                    [this.CONSTS.SOLDIER_ROLE_COMMANDO]: 0,
                    [this.CONSTS.SOLDIER_ROLE_SHOOTER]: 0,
                    [this.CONSTS.SOLDIER_ROLE_ARTILLERY]: 0,
                    [this.CONSTS.SOLDIER_ROLE_SAPPER]: 0,
                    [this.CONSTS.SOLDIER_ROLE_MEDIC]: 0,
                    [this.CONSTS.SOLDIER_ROLE_CLAIMER]: 0,
                };
                Memory.spawns[s]['role'] = this.CONSTS.SPAWN_ROLE_NORMAL;
                Memory.spawns[s]['worker_level'] = 1;
                Memory.spawns[s]['soldier_level'] = 1;
            }
        };

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
                    Memory.towers[s].role = this.CONSTS.TOWER_ROLE_NORMAL;
                }
            }

            // link settings
            if (struct.structureType == STRUCTURE_LINK) {
                if (!Memory.links[s]) {
                    Memory.links[s] = {};
                    Memory.links[s].role = this.CONSTS.LINK_ROLE_NORMAL;
                }
            }
        }
    },


    _cleansing: function () {
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


    _update_memory: function () {
        // var colorGroup = {
        //     COLOR_PURPLE: CONSTS.SOLDIER_ROLE_TANK, // 2,
        //     COLOR_BLUE: CONSTS.SOLDIER_ROLE_COMMANDO,// 3,
        //     COLOR_CYAN: CONSTS.SOLDIER_ROLE_SHOOTER, //4,
        //     COLOR_GREEN: CONSTS.SOLDIER_ROLE_ARTILLERY, //5,
        //     COLOR_YELLOW: CONSTS.SOLDIER_ROLE_SAPPER, //6,
        //     COLOR_ORANGE: CONSTS.SOLDIER_ROLE_CLAIMER, //7,
        //     COLOR_BROWN: CONSTS.SOLDIER_ROLE_MEDIC, //8,
        //     COLOR_RED : 'all',
        // };

        // for (var f in Game.flags) {
        //     var flag = Game.flags[f];
        //     var name = "Group-" + flag.color + '-' + colorGroup[flag.secondaryColor] + '-' + Game.time;
        //     // flag.setname(name);
        // }
    },


    _userCommand: function () {
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
        }
    },

    
    _arrange_harvester: function () {
        // 每个资源点有几个creep
        var current = {};
        for (var r in Game.rooms) {
            var room = Game.rooms[r];
            if (room.controller && room.controller.my) {
                var sources = room.find(FIND_SOURCES);
                for (var s in sources) {
                    var source = sources[s];
                    current[source.id] = 0;
                }
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
            if (room.controller && room.controller.my) {
                var resourceSetting = Memory.rooms[r].resourceSetting;
                for (var r in resourceSetting) {
                    settings[r] = resourceSetting[r];
                }
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
                    creep.memory.role == this.CONSTS.WORKER_ROLE_HARVESTER
                    && creep.memory.harvest_source == c
                );

                if (tcreeps.length > 0) {
                    // tcreeps[0].memory.harvest_source = undefined;
                    tcreeps[0].memory.harvest_source = null;
                }
            }

            if (sett > curr) { // 资源点creep小于设置的， 找空目标的creep分配过来, 一个就行， 反正要循环嘛

                var source_room = Game.getObjectById(c).room;

                var tcreeps = _.filter(Game.creeps, (creep) =>
                    creep.memory.role == this.CONSTS.WORKER_ROLE_HARVESTER
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



}

module.exports = sys;
