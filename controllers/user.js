const user = require('../models/user');

const jwt = require('jsonwebtoken');
let token;
exports.login = (req, res) => {
  user.getOne(req.body.username).then((data) => {
    if(data.hits.hits.length === 0 ){
      res.status(401);
      res.json({
        message: 'Username or password is wrong',
      });
    }
    else
    {
      const pass = data.hits.hits[0]._source.password;
      user.comparePassword(req.body.password, pass).then((data) => {
        if(data){
          token = jwt.sign({
          username: req.body.username,
          password: pass,
          }, 'SUPER_SECRET', { expiresIn: 60*60 })
          res.status(200);
          res.json({
            token: token,
            ttl: 60*60,
            message: 'You are logged',
          });
        }
        else{
          res.status(401);
          res.json({
            message: 'Username or password is wrong',
          });
        }
      })
    }
  }).catch((err) => {
    res.json(err);
  })
};

exports.logout = (req, res) => {
  let tokenReq = (req.query && req.query.access_token) || req.headers['x-access-token'];
  if(tokenReq == token){
    jwt.verify(tokenReq, 'SUPER_SECRET', (err, user) => {
      if(err) {
        return res.json(err);
      }
      else
      {
          //Clear token
          token = jwt.sign({ username: user.username, password: user.password }, 'SUPER_SECRET', {expiresIn: 0});
          res.json({
            message: 'logout',
          });
      }
    });
  }
  else{
    res.json({
      message: 'Token is not valid',
    })
  }
};

// Register
exports.register = (req, res) => {
  user.getOne(req.body.username).then((data) => {
    if(data.hits.hits.length === 0){
      user.hashPassword(req.body.password).then((password) => {
        let name = req.body.name;
        if(name === '') {
          name = req.body.username;
        }
        user.registerUser(req.body.username, password, name).then((dataabc) => {
          res.json({
            message: 'Success',
          });
        }).catch((errabc) => {
          res.json(errabc);
        });
      }).catch((err) => {
        res.json(err);
      });
    }else{
      res.json({
        message: 'user exists',
      });
    }
  }).catch((err) => {
    res.json(err);
  });
};