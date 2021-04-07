const config = require('config.json');
const jwt = require('jsonwebtoken');
const pool = require('../_helpers/db');

// users hardcoded for simplicity, store in a db for production applications
// const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    const SQL = `SELECT * from users where username = '${username}' and password = '${password}'`;
    return new Promise((resolve, reject) => {
        pool.query(SQL, (err, result) => {
            if (err) {
                console.log(err);
                resolve({
                    isError: true,
                    errpr: err,
                })
            } else {
                if (result.length < 0) throw 'Username or password is incorrect';

                // create a jwt token that is valid for 7 days
                const token = jwt.sign({ sub: result[0].id }, config.secret, { expiresIn: '7d' });

                resolve({
                    isError: false,
                    result: {
                        ...omitPassword(result[0]),
                        token
                    }
                })
            }
        });
    });
}

async function getAll() {
    const SQL = `SELECT * from users`;
    return new Promise((resolve, reject) => {
        pool.query(SQL, (err, result) => {
            if (err) {
                console.log(err);
                resolve({
                    isError: true,
                    error: err,
                })
            } else {


                resolve({
                    isError: false,
                    result: result.map(u => omitPassword(u))
                })
            }
        });
    });
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
