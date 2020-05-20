const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const connector = Promise.promisifyAll(require('./connector'));

const saltRound = parseInt(process.env.PASSWORD_SALT_ROUND);

exports.hashPassword = (password) => {
  return bcrypt.hash(password, saltRound).then((hash) => {
    return hash;
  }).catch((err) => {
    return err;
  });
};

exports.comparePassword = (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword).then((isMatch) => {
   return isMatch;
  }).catch((err) => {
    return err;
  });
};

exports.authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    connector.search({
      index: 'chatchit',
      type: 'user',
    });
  });
};

exports.registerUser = (username, password, name) => {
  return new Promise((resolve, reject) => {
    connector.index({
      index: 'chatchit',
      type: 'user',
      body: {
        username: username,
        password: password,
        name: name
      }
    }, (err, data) => {
      if(data)
        return resolve(data);
      else
        return reject(err);
    })
  });
};

exports.getOne = (username) => {
  return new Promise((resolve, reject) => {
    connector.search({
      index: 'chatchit',
      type: 'user',
      body: {
        query: { match : {
          username,
        }},
      },
    }, (err, resp) => {
      if(err){
        reject(err);
      }else{
        resolve(resp);
      }
    });
  });
}
