/**
 * Created by Alibek on 15.10.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");

var client = mbClient(function (isRec) {
   client.sendRequest('/period/closePeriod', {}, function(err, request){
     if (err ) return console.log('error ' + err.errorMessage);
       console.log('done');
   });
});
