var CONSTS = require('Sys').CONSTS;
var roleSoldier = {
    run: function (creep) {
        this[creep.memory.role].run(creep);
    },

    [CONSTS.SOLDIER_ROLE_TANK]:
    {
        new: function () { },
        run: function () { },
    },

    [CONSTS.SOLDIER_ROLE_COMMANDO]:
    {
        new: function () { },
        run: function () { },
    },

    [CONSTS.SOLDIER_ROLE_SHOOTER]:
    {
        new: function () { },
        run: function () { },
    },

    [CONSTS.SOLDIER_ROLE_ARTILLERY]:
    {
        new: function () { },
        run: function () { },
    },

    [CONSTS.SOLDIER_ROLE_MEDIC]:
    {
        new: function () { },
        run: function () { },
    },


}


module.exports = roleSoldier;
