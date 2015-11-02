var clientFactory = require("devir-mbclient");
var unoconv = require('unoconv2');
var fs = require('fs');
var Docxtemplaters = require('docxtemplater');
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {

    // var way="/InOut/template.docx";
    //var templateData=fs.readFileSync(__dirname+ "/InOut/input.docx");
    var templateData = "56287768a105775f0faed15f";

    client.sendRequest("/templater/templaterData", {
        templating: templateData,
        data: {
            first_name: "Нуркасым",
            phone: "33-22-11",
            last_name: "Бахрамов",
            description: "Информация",
            price: "150 000"
        }
        //description:"News"
    }, function (err, data) {
        if (err) {
            console.log("errOR");
            console.log(err);
        }
        else {
            console.log("dATA");
            console.log(data);
            /*var bb = new Buffer(data.result.buf.data);
             fs.writeFileSync(__dirname+"/InOut/output.docx",bb);
             unoconv.convert('/home/nurkasym/BillingController/services/templateDocx/InOut/output88.docx', 'pdf', function (err, result) {
             console.log(err);
             fs.writeFile('/home/nurkasym/BillingController/services/templateDocx/InOut/output88converted.pdf', result);
             });*/
        }
    })
});