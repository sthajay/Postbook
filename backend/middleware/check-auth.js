const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

  try {
    const token = req.headers.authentication.split(' ')[1];
    const decodedToken = jwt.verify(token, 'j_lekheni_hunxa_but_it_must_be_long');
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();

  }
  catch (error) {
    res.status(401).json({
      message: 'Authentication failed!!'
    });
  }

};


