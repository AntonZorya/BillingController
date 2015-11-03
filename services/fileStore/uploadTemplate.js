var db = require('../common/dbConnection/mongo').getDb();
var mongo = require('../common/dbConnection/mongo').mongo;

var Grid = require('gridfs');
var gfs = Grid(db, mongo);

var fs = require('fs');

fs.readFile('inputData/template.docx', function (error, data) {
    if (error) {
        console.error(error);
    } else {
        gfs.writeFile({
            filename: 'template.docx'
        }, data, function (error, result) {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }
});