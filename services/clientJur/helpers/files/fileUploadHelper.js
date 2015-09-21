var multer = require('multer');
var Logic = require('../../logicLayer/files/filesLogic');
var async = require("async");

module.exports = function(app) {
    app.post('/api/files/upload', [multer({dest: './uploads/'}), function (req, res) {
            //console.log(req.files);
        var tmpArr = [];
        var filesArr = [];

        _.each(req.files, function(file){filesArr.push(file)});


        async.each(filesArr, function(file, done){
            Logic.add(file, req.user._id, function(data){
                tmpArr.push(data);
                done();
            });
        }, function(err){
            res.status(200);
            res.json(tmpArr);
        });
    }]);

    app.get('/api/file', function(req,res){

        if(!req.query._id)  {
         res.status(400);   return  res.json({error: "Bad request"});
        }

        if(!req.query.size)
        {
            req.query.size = "original";
        }

               Logic.get(req.query._id, req.query.size, function(data) {
                   if(data.operationResult!=0)
                   return operationResultBuilder(data, res);
                   else{
                       if(data.fileName) res.setHeader('Content-disposition', 'attachment; filename=' + data.fileName);
                       if(data.mimeType)  res.setHeader('Content-type', data.mimeType);
                         res.setHeader('Content-Length', data.result.length);
                         res.write(data.result, 'binary');
                         res.end();

                   }
               });
    });
};