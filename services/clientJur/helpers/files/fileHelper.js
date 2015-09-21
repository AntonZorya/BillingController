/**
 * Created by mac on 14.06.15.
 */
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.update({ accessKeyId: 'AKIAJX24SVBBWONEN4IA', secretAccessKey: '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' });
AWS.config.region = 'eu-west-1';


exports.saveFile = function(file, type, done){
fs.readFile('./uploads/'+file.name, function (err, data) {
    if (err) { throw err; }

    var base64data = new Buffer(data, 'binary');
    if(type==0){
    var s3 = new AWS.S3();
    s3.putObject({
        Bucket: 'rentor',
        Key: file.name,
        Body: base64data
    }, function (err, data) {
        if (err) return done({operationResult: 1, result: "File write error"});
        done({operationResult:0, result:"All ok"});
    });
    } else if (type==1){
        fs.writeFile("./data_Storage/"+file.name, base64data, function(err) {
            if (err) return done({operationResult: 1, result: "File write error"});
            done({operationResult: 0, result: "All ok"});
        });
    }

});
}

exports.getFile = function(file, size, type, done){
    if(type==0) {
        var s3 = new AWS.S3();
        s3.getObject({
            Bucket: 'rentor',
            Key: file.name + size
        }, function (err, data) {

            if (err) return done({operationResult: 1, result: "File read error"});
            return done({operationResult:0, result: data});
        });
    }
    else if (type==1){
        fs.readFile("./data_Storage/"+file.fileName, function(err,data){
            if(err) return done({operationResult:1, result: "File read error"});
            done({operationResult:0, result: data});
        });
    }
}

exports.getIconForDocument = function(extension, done){
    fs.readFile("./misc/icons/"+extension+".png", function(err,data){
        if(err) return done({operationResult:1, result: "File read error"});
        done({operationResult:0, result: data});
    });
}
