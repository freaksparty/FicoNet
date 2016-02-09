var User       = require("../../models").User,
	authconfig = require("../../config/auth.js"),
	utils      = require("../../utils"),
	User;

module.exports = {
	makePassword : function (password) {
	    return User.generateHash(password, authconfig.config().salt);
	},

	makeHash : function (email) {
	    return User.generateHash(email, ""+Math.random());
	},

	sendEmail : function (email, host, newpassword, end) {
	    utils.tryThrowableFunction(function () { 
	        utils.sendEmail(
	            email, 
	            "FICONET: Cambio de contraseña", 
	            "Acceda al siguiente enlace para cambiar la contraseña: <a href='http://"+host+"/changepassword/"+newpassword+"'>Cambiar contraseña</a><br>Consulte con alguien de la organización si tiene algún problema", 
	            end);
	    }, end);
	}	
}

