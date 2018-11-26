import * as CryptoJS from 'crypto-js';
import { CryptoConfig } from './constant';

// 管理系统 AES密钥 , AES向量
const { key: ManageAesKey, iv: ManageAesIv } = CryptoConfig.ManageAES;
// 用户登录 AES密钥 , AES向量
const { key: LoginAesKey, iv: LoginAesIv } = CryptoConfig.LoginAES;


/**
 * AES加密，返回Base64编码
*/
const AESEncrypt = (str, aesKey, aesIv) => {
  const encrypted = CryptoJS.AES.encrypt(str, CryptoJS.enc.Hex.parse(aesKey), {
    iv: CryptoJS.enc.Hex.parse(aesIv),
    // mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * AES解密,参数Base64编码
 */
const AESDecrypt = (str, aesKey, aesIv) => {
  const decrypted = CryptoJS.AES.decrypt(str, CryptoJS.enc.Hex.parse(aesKey), {
    iv: CryptoJS.enc.Hex.parse(aesIv),
    // mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 管理系统AES加密
 */
export function ManageEncrypt(str) {
  return AESEncrypt(str, ManageAesKey, ManageAesIv);
}

/**
 * 管理系统AES解密
 */
export function ManageDecrypt(str) {
  return AESDecrypt(str, ManageAesKey, ManageAesIv);
}

/**
 * 用户登录AES加密
 */
export function LoginEncrypt(str) {
  return AESEncrypt(str, LoginAesKey, LoginAesIv);
}

/**
 * 用户登录AES解密
 */
export function LoginDecrypt(str) {
  return AESDecrypt(str, LoginAesKey, LoginAesIv);
}