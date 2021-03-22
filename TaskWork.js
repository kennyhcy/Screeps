const task = {
    carry: function (icreep) {
        var creep = Game.creeps[icreep.name];
        var working_from = Game.getObjectById(creep.memory.working_from);
        var working_to = Game.getObjectById(creep.memory.working_to);
        var resource_type = creep.memory.working_resource;
        //console.log('check3',resource_type);

        if (creep.store[resource_type] <= 0) {
            if (creep.withdraw(working_from, resource_type) != 0) {
                creep.moveTo(working_from);
            }
        }
        else {
            if (creep.transfer(working_to, resource_type) != 0) {
                creep.moveTo(working_to);
            } else {
                creep.memory.working = null;
            }
        }
        
    },
}
module.exports = task;