exports.buildOperationOutcome = function(result, res){
	
	if(result.operationResult==1) res.status(500);
	if(result.operationResult==2 || result.operationResult==3) res.status(400);
	
	res.json(result);
}