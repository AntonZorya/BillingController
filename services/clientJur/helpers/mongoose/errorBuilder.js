exports.buildError = function (err) {
	if (err.name)
		if (err.name == 'ValidationError') return { operationResult: 2, result: [err] };
	return { operationResult: 1, result: err };
};