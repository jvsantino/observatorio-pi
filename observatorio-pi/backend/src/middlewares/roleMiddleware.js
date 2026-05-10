const roleMiddleware = (...rolesPermitidas) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }

    next();
  };
};

module.exports = roleMiddleware;
