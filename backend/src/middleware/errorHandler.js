<<<<<<< HEAD
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;


=======
function errorHandler(err, req, res, next){
    console.log(err);
    const status =err.status || 500;
    res.status(status).json({error: err.message || 'Internal server Error'});
}
module.exports = errorHandler;
>>>>>>> 544d47a4b4540a8a508aa8e7a7279a6d0c46be10
