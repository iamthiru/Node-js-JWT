import {NativeModules} from 'react-native'
var nativeModules = NativeModules;
var Aes = NativeModules.Aes

 export const encryptData =  (msg, key) => {
     console.log('---aes----data----',nativeModules)
    return Aes.randomKey(16).then(iv => {
        return Aes.encrypt(msg, key, "abf1732bc27507760becbf514344f0ef").then(cipher => ({
            cipher,
            iv,
        }))
    })
}
export const decryptData = async(encryptedData, key) =>{
    try{
        return   await Aes.decrypt(encryptedData.cipher, key, encryptedData.iv)
    }
    catch(err){
        console.log('---decrption error ****----',err)
    }
  
} 
 