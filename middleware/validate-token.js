const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = (req.query && req.query.access_token) || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, 'SUPER_SECRET', (err, data) => {
      if(err) {
        res.json({
          Error: err,
        })
      }
      else
      {
        if(data.username === 'admin' && data.password === 'admin'){
          jwt.sign({
            username: 'admin',
            password: 'admin',
          }, 'SUPER_SECRET', {
            expiresIn: 0
          })
          next();
        }
        else{
          res.json({
            message: 'Invalid token',
          })
        }
      }
    });
  }
  else{
    res.status(401);
    res.json({
      status: 401,
      message: 'Invalid token',
    })
  }
}

