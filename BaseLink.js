//BaseLink
//2021-03-15

var CONSTS = require('Sys').CONSTS;

var baseLink = {
    run: function (link) {
        var memory = null;
        if (!Memory.links[link.id]) {
            console.log('ERROR ', link.id, ' is not created in the memory');
        } else {
            memory = Memory.links[link.id];
            //console.log(memory);
        }

        if (memory && memory.role == CONSTS.LINK_ROLE_HARVEST_SITE
            && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // console.log('check');
            var targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (center) => {
                    return center.structureType == STRUCTURE_LINK
                        && Memory.links[center.id]
                        && Memory.links[center.id].role == CONSTS.LINK_ROLE_CENTER
                        && center.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if (targets.length > 0) {
                link.transferEnergy(targets[0]);
            }
        };


        if (memory && memory.role == CONSTS.LINK_ROLE_CENTER
            && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // console.log('check');
            var targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (center) => {
                    return center.structureType == STRUCTURE_LINK
                        && Memory.links[center.id]
                        && Memory.links[center.id].role == CONSTS.LINK_ROLE_NORMAL
                        && center.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if (targets.length > 0) {
                targets.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
                link.transferEnergy(targets[0]);
            }
        };


    },
}


module.exports = baseLink;

