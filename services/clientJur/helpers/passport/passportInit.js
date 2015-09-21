var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var TokenLogic = require('../../logicLayer/identity/tokenLogic');
var _ = require('underscore');


exports.isInrole = function(user, roleName){
		var role = _.find(user.roles, function(role){role.roleName == roleName})
		if(role)
			return true
		else return false;
}

exports.init = function(app){
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new BearerStrategy(
		function(token, done) {
			TokenLogic.findByToken(token, function(data){
				if(data.operationResult==0)
					if(data.result)
						return done(null, data.result.user._doc);
					return done(null,false);
				});
		}));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		done(null,null); //не понял зачем это тут!
	});
}

exports.mustAuthenticatedMw = function (req, res, next){
	passport.authenticate('bearer', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { res.status(401); return res.json("Unauthorized"); }
		req.logIn(user, function(err) {
			if (err) { return next(err); 
			}
			next();
		});
	})(req, res, next);
};

exports.checkRoles = function(req, roles){
	_.each(req.user.roles, function(elem)
		{
			_.each(roles, function(role){
				if(role == elem) return true;
			})
		})
	return false;
}

exports.secureRoutes = function(app, passport){
    app.all('/api/finance*', passport.mustAuthenticatedMw);
    app.all('/api/identity/menu', passport.mustAuthenticatedMw);
	app.all('/api/language/add', passport.mustAuthenticatedMw);
    app.all('/api/files/upload', passport.mustAuthenticatedMw);
    app.all('/api/identity/user', passport.mustAuthenticatedMw);
    app.all('/api/identity/users', passport.mustAuthenticatedMw);
    app.all('/api/clientFiz*', passport.mustAuthenticatedMw);
    app.all('/api/clientsFiz*', passport.mustAuthenticatedMw);
    app.all('/api/clientJur*', passport.mustAuthenticatedMw);
    app.all('/api/clientsJur*', passport.mustAuthenticatedMw);
}