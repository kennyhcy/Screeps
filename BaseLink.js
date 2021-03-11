//BaseLink
//2021-03-08 23:25

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
            && link.store.getUsedCapacity(RESOURCE_ENERGY) >= 100) {
            // console.log('check');
            var targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (center) => {
                    return center.structureType == STRUCTURE_LINK
                        && Memory.links[center.id]
                        && Memory.links[center.id].role == CONSTS.LINK_ROLE_CENTER
                        && center.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });

            if (targets) {
                link.transferEnergy(targets[0]);
            }
        }
    },
}

 
module.exports = baseLink;

