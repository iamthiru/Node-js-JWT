import Api from '.';

export const initiateVideoProcessingAPI = (fileName) => {
    return new Promise((resolve, reject) => {
        Api.get(
            `/${fileName}`
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}