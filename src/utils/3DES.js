import cryptoJs from 'crypto-js';

// 3DES 加密
export const encryptByDES = (dataStr, key) => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const encrypted = cryptoJs.TripleDES.encrypt(dataStr, keyHex, {
    mode: cryptoJs.mode.ECB, // CBC模式
    padding: cryptoJs.pad.Pkcs7, // pkcs7padding 填充方式
  });
  // return encrypted.ciphertext.toString(); // 返回 hex 编码格式
  return encrypted.toString(); // 返回 base64 编码格式
}

// 3DES 解密
export const decryptByDES = (ciphertext, key) => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const decrypted = cryptoJs.TripleDES.decrypt({
    // ciphertext: cryptoJs.enc.Hex.parse(ciphertext) // hex 编码解密
    ciphertext: cryptoJs.enc.Base64.parse(ciphertext) // base64 编码解密
  }, keyHex, {
    mode: cryptoJs.mode.ECB, // CBC模式
    padding: cryptoJs.pad.Pkcs7, // pkcs7padding 填充方式
  });
  return decrypted.toString(cryptoJs.enc.Utf8); // 返回 base64 编码格式
}
