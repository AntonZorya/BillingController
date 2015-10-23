/**
 * Created by Alibek on 25.09.2015.
 */
var resultFactory = commonRequire('operations/resultFactory');
var mbClient = commonRequire('mbConnection/netConnection');
var db = commonRequire('dbConnection/orientDB');

var counterDefinition = rootRequire("data/models/counter");
var pipeline_to_counter = rootRequire('data/links/pipeline_to_counter');



var client = mbClient(function(isRecconnecting) {

    client.registerRoute("/counter/create", function(request){

    });


});