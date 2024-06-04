const crypto = require('crypto');

const encrpyt = (contra) => {
let cipher =crypto.createCipher('aes192','a password');
let encriptado =cipher.update(contra,'utf8','hex');
encriptado = cipher.final('hex');
return encriptado;
}


const decrpyt = (contraEn) => {
    let decipher = crypto.createDecipher('aes192','a password');
    let desencriptado = decipher.update(contraEN,'hex','utf8');
    desencriptado = decipher.final('utf8');
    return desencriptado;
}

module.exports = { encrpyt, decrpyt };