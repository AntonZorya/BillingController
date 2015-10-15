/**
 * Created by Alibek on 25.09.2015.
 */
var resultFactory = commonRequire('operations/resultFactory');
var mbClient = commonRequire('mbConnection/netConnection');
var db = commonRequire('dbConnection/orientDB');

var accrualModel = rootRequire('data/models/accrual');
var client_to_accrual = rootRequire('data/links/client_to_accrual');
var pipeline_to_accrual = rootRequire('/data/links/pipeline_to_accrual');
var counter_to_accrual = rootRequire('/data/links/counter_to_accrual');

var client = mbClient(function (isReconnecting) {

    client.registerRoute("/accrual/add", function(request) {
        var accrual = accrualModel.create();


    } );


    client.subscribeToQueueChange("")



    this.calculateAccrualByCounter = function(counterId, periodId)
    {
        client.sendRequest("/counter",)
    }

    client.registerService();

});