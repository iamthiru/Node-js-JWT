import Api from '.';
import axios from 'axios';
import { AWS_API_URL } from '../constants/aws';

export const initiatePupilVideoProcessingAPI = (fileName) => {
    return new Promise((resolve, reject) => {
        axios.get(`${AWS_API_URL}/mobile_pupil_api/${fileName}`).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
        /* Api.get(
            `/mobile_pupil_api/${fileName}`
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        }); */
    });
}

export const initiateFacialExpressionVideoProcessingAPI = (fileName) => {
    return new Promise((resolve, reject) => {
        axios.get(`${AWS_API_URL}/mobile_facial_api/${fileName}`).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
        /* Api.get(
            `/mobile_facial_api/${fileName}`
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        }); */
    });
}