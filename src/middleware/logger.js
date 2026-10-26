function logger(req, res, next) {
  const inicioCuenta = Date.now();
  res.on("finish", () => {
    const tiempo = Date.now() - inicioCuenta;
    console.log(
      `${req.method} ${req.originalUrl}: ${tiempo}ms => ${res.statusCode}`,
    );
  });
  next();
}

module.exports = logger;
