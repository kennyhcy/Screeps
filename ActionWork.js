var work = {
    harvest: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' harvest fail: ', ret);
            }
        } else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    store: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' store fail: ', ret);
            }
        }
        else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    pickup: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' pickup fail: ', ret);
            }
        }
        else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    withdraw: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' withdraw fail: ', ret);
            }
        }
        else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    build: function (creep) {
        var target = Game.getObjectById(creep.memory.working_target);
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            && target) {

            var ret = creep.build(target);
            if (ret == OK || ret == ERR_BUSY) {
                // console.log('Check point1');
            } else if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                //console.log('ERROR : ', creep.name, ' build fail: ', ret);
            }
        } else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    refill: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' refill fail: ', ret);
            }
        }
        else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    repair: function (creep) {
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
                //console.log('ERROR : ', creep.name, ' repair fail: ', ret);
            }
        } else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },

    upgrade: function (creep) {
        var target = Game.getObjectById(creep.memory.working_target);
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            && target) {

            var ret = creep.upgradeController(target);
            if (ret == OK || ret == ERR_BUSY) {
                // console.log('Check point1');
            } else if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                //console.log('ERROR : ', creep.name, ' upgradeController fail: ', ret);
            }
        } else {
            creep.memory.working = null;
            creep.memory.working_target = null;
        }
    },
};

module.exports = work;