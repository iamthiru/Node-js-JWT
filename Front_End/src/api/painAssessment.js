import Api from '.';

export const initiatePupilVideoProcessingAPI = (fileName) => {
    return new Promise((resolve, reject) => {
        Api.get(
            `/mobile_pupil_api/${fileName}`
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const initiateFacialExpressionVideoProcessingAPI = (fileName) => {
    return new Promise((resolve, reject) => {
        Api.get(
            `/mobile_facial_api/${fileName}`
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}