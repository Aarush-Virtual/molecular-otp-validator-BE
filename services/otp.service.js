const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

module.exports = {
	name: "otp",
	actions: {
		generate(ctx) {
			const secret = speakeasy.generateSecret({ length: 20 });
		    // otpauth://totp/MyApp:undefined?secret=PIXDCYTNOQ7EGP3NOQXCGXLQNQ5TI6RQ&issuer=MyApp
			const otpauthUrl = `otpauth://totp/MyApp:${ctx.params}?secret=${secret.base32}&issuer=MyApp`;
			return new Promise((resolve, reject) => {
				QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
					if (err) {
						reject(err);
					} else {
						// here it ideally should be stored in the database but now we are storing in the config file 
						ctx.call("config.saveSecret" , {
							username : ctx.params,
							secret : secret.base32
						}).then(()=>{
							resolve({
								// otp: secret.base32,
								qrCodeUrl: dataUrl
							});
						})
						.catch(reject)
					}
				});
			});
		},
		async validate(ctx) {
			const username = ctx.params.username;
			const secretFromConfig = await ctx.call("config.validateSecretFromConfigFile" , {username : username});
			console.log(secretFromConfig);
			
			const verified = speakeasy.totp.verify({
				secret: secretFromConfig,
				encoding: "base32",
				token: ctx.params.code
			});
			return verified;
		}
	}
};
