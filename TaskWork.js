// TaskWork.js

const TASK = {
    assign: function (action, from, to, rt, step = 0) {
        var task = {
            action: action,
            from: from,
            to: to,
            rt: rt,
            step: step,
        };
        return task;
    },

    execute: function (creep) {
        // var creep = Game.creeps[icreep.name];
        if (!creep.memory.task || !creep.memory.task.action) {
            creep.memory.task = undefined;
            return;
        }
        if (!creep.memory.task.step || creep.memory.task.step <= 0) {
            creep.memory.task.step = 1;
        }

        if (task.action == 'carry') {
            this._task_carry(creep);
        }

        if (task.action == 'pickup') {
            this._task_pickup(creep);
        }
    },

    _withdraw: function (creep, tid, rt) {
        let ret = -99;
        let target = Game.getObjectById(tid);
        if (!target) {
            return -99;
        }
        if (creep.store.getFreeCapacity(rt) <= 0) {
            return -99;
        }
        ret = creep.withdraw(target, rt);
        if (ret == ERR_NOT_IN_RANGE) {
            ret = creep.moveTo(target);
        }
        return ret;
    },

    _pickup: function (creep, tid, rt) {
        let ret = -99;
        let target = Game.getObjectById(tid);
        if (!target) {
            return -99;
        }
        if (rt != target.resource_type) {
            return -97;
        }
        if (creep.store.getFreeCapacity(rt) <= 0) {
            return -98;
        }
        ret = creep.pickup(target);
        if (ret == ERR_NOT_IN_RANGE) {
            ret = creep.moveTo(target);
        }
        return ret;
    },

    _transfer: function (creep, tid, rt) {
        let ret = -99;
        let target = Game.getObjectById(tid);
        if (!target) {
            ret = -99;
            return ret;
        }
        if (creep.store[rt] <= 0) {
            ret = -98;
            return ret;
        }
        ret = creep.transfer(target, rt);
        if (ret == ERR_NOT_IN_RANGE) {
            ret = creep.moveTo(target);
        }
        return ret;
    },



    _task_carry: function (creep) {
        var task = creep.memory.task;
        var ret;

        if (task.step <= 1) {
            ret = this._withdraw(creep, task.from, task.rt);
        }

        if (ret == 0 && creep.store[task.rt] > 0) {
            task.step = 2;
        }

        if (task.step == 2) {
            ret = this._transfer(creep, task.to, task.rt);
        }

        if (ret == 0 && creep.store[task.rt] <= 0) {
            task = null;
        }
    },

    _task_pickup: function (creep) {
        var task = creep.memory.task;
        var ret;

        if (task.step <= 1) {
            ret = this._pickup(creep, task.from, task.rt);
        }

        if (ret == 0 && creep.store[task.rt] > 0) {
            task.step = 2;
        }

        if (task.step == 2) {
            ret = this._transfer(creep, task.to, task.rt);
        }

        if (ret == 0 && creep.store[task.rt] <= 0) {
            task = null;
        }
    },
}
module.exports = TASK;