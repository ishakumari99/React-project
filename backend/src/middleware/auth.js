const jwt = require('jsonwebtoken');
<<<<<<< HEAD

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = auth;


=======
function auth(req, res, next){
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer') ? header.slice(7) : null;
    if (!token) return res.status(401).json({error: 'unauthorized'});
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        req.user = {id: payload.id};
        next();
        
    } catch(e){
        return res.status(401).json({error: 'Invalid token'});
    }
}
module.exports = auth;

    
>>>>>>> 544d47a4b4540a8a508aa8e7a7279a6d0c46be10
