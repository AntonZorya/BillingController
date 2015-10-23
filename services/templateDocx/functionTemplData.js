var fs=require('fs');
var Docxtemplater=require('docxtemplater');

function templateData(content, template){
    var doc = new Docxtemplater(template);
    doc.setData(content);
    doc.render();
    var buf = doc.getZip()
        .generate({type:"nodebuffer"});

    fs.writeFileSync(__dirname+"/inOut/output11.docx",buf);
    console.log("Запись завершена");
}
exports.templateData=templateData