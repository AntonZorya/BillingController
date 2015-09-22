var fs = require('fs');

var registrator = function(router, dir) {
	var fs = fs || require('fs'),
	files = fs.readdirSync(dir);
	
	files.forEach(function(file) {
		if(file.charAt(0)!='.')
			if (fs.statSync(dir +'/'+ file).isDirectory()) {
				registrator(router, dir +'/'+ file );
			}
			else {
				if((/.js$/).test(file)){


					require('../../'+dir +'/'+ file.replace(".js",''))(router);

					console.log("Controller "+dir +'/'+ file+" successfully registered");
				}
			}
		});
	
};


module.exports = function(router, dir){
	registrator(router, dir);
}