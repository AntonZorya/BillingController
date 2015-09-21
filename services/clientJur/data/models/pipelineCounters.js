var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition =
    [{
        counterNumber: {type: String},
        currentStatus: {type: String},
        currentCounts: {type: Number},
        dateOfCurrentCounts: {type: Date},
        problem: {type: String},
        problemDescription: {type: String},
        lastCounts: {type: Number},
        dateOfLastCounts: {type: Date},
        hasProblem: {type: Boolean},
        installDate: {type: Date},//дата установки счетчика
        checkDate: {type: Date},//дата след. проверки
        removeDate: {type: Date},//дата снятия счетчика
        plumbNumber: {type: String},
        plumbInstallDate: {type: Date},
        markId: {type: Schema.Types.ObjectId, ref: 'CounterMark'},//марка счетчика
        fileIds: [], //акт снятия, акт установки
        isActive: {type: Boolean},
        isCounterNew: {type: Boolean},
        isPrevAvgCalculated: {type: Boolean} // после замены счетчика - был ли расчет по среднему
    }];