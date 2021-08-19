import {NativeModules} from 'react-native';
let Aes = NativeModules.Aes;

export const encryptData = (msg, key) => {
  return Aes.randomKey(16).then((iv) => {
    return Aes.encrypt(msg, key, iv).then((cipher) => ({
      cipher,
      iv,
    }));
  });
};
export const decryptData = async (encryptedData, key) => {
  return await Aes.decrypt(encryptedData.cipher, key, encryptedData.iv);
};
