//BaseLink
//2021-03-15


// link roles:
const LINK_ROLE = {
    NORMAL: 'normal', // consumer site
    HARVEST_SITE: 'harvest_site',
    CENTER: 'center',
}

var baseLink = {
    LINK_ROLE: LINK_ROLE,
    run: function (link) {
        var memory = null;
        if (!Memory.links[link.id]) {
            console.log('ERROR ', link.id, ' is not created in the memory');
        } else {
            memory = Memory.links[link.id];
            //console.log(memory);
        }

        if (memory && memory.role == LINK_ROLE.HARVEST_SITE
            && link.store.getUsedCapacity(RESOURCE_ENERGY) > 400) {
            // console.log('check');
            var targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (center) => {
                    return center.structureType == STRUCTURE_LINK
                        && Memory.links[center.id]
                        && Memory.links[center.id].role == LINK_ROLE.CENTER
                        && center.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if (targets.length > 0) {
                link.transferEnergy(targets[0]);
            }
        };


        if (memory && memory.role == LINK_ROLE.CENTER
            && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            // console.log('check');
            var targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (center) => {
                    return center.structureType == STRUCTURE_LINK
                        && Memory.links[center.id]
                        && Memory.links[center.id].role == LINK_ROLE.NORMAL
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

