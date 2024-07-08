const path = require("path");
const fs = require("fs");
module.exports = {
    name: "config",
    settings: {
      secret: null
    },
    actions: {
      saveSecret(ctx) {
        const { username, secret } = ctx.params;
        console.log({
          username, secret
        })
        const configFilePath = path.join(__dirname, '../config/otpSecrets.json');
        return new Promise((resolve, reject) => {
          fs.readFile(configFilePath, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
              console.log("error in the fs read file ")
              reject(err);
            } else {
              const secrets = data ? JSON.parse(data) : [];
              const existingUser = secrets.find(u => u.username === username);
              if(existingUser) {
                return reject({error : "Username already exists " , success : false})
              }
              const newEntry = { username, secret, time: new Date().toISOString() };
              secrets.push(newEntry);
              fs.writeFile(configFilePath, JSON.stringify(secrets, null, 2), 'utf8', (err) => {
                if (err) {
                  console.log('error in the fs write file method  ' , err);
                  return reject(err);
                } else {
                  resolve({ success: true });
                }
              });
            }
          });
        });
      },
      validateSecretFromConfigFile (ctx) {
        const { username } = ctx.params;
			const configFilePath = path.join(__dirname, '../config/otpSecrets.json');
			return new Promise((resolve, reject) => {
				fs.readFile(configFilePath, 'utf8', (err, data) => {
					if (err) {
						reject(err);
					} else {
						const secrets = JSON.parse(data);
						const user = secrets.find(u => u.username === username);
            resolve(user ? user.secret : null);
					}
				});
			}); 
      }
    }
  };
  