import Api from '.';

export const loginAPI = (loginData) => {
    return new Promise((resolve, reject) => {
        Api.post(
            `users/authenticate`,
            JSON.stringify(loginData),
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        ).then((res) => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}