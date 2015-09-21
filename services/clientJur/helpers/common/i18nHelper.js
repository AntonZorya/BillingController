_i18nString = require(_modelsPath+'i18n/i18nString').definition;
var TranslateLogic = require(_logicPath+'i18n/translationLogic');

translations = {};
exports.reloadTransltaions = function(done){	
	TranslateLogic.getAllTranslations(function(data){
		if(data.operationResult==1) {console.log("Error"+data.result); return }
		translations = data.result;
		if(done)done();
	});

}
exports.translate = function(text, languageCode){
	var trans = _.find(translations, function(translation){
		return translation._doc.text == text;
	});
	if(trans){
		var translation = _.find(trans.translate, function(tr){
				return tr.languageCode == languageCode;
			});
		if(translation)
		{
			return translation.text;
		}
		else{
			return languageCode+":"+text;
		}
	} else{
		return languageCode+":"+text;
	}
	

}	