/**
 * Fábrica de middlewares RBAC que valida se o papel (role) do usuário autenticado
 * está contido na lista de roles permitidas.
 * Exemplo: checkRole(['ADM', 'TI'])
 */
function checkRole(rolesPermitidas = []) {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.role) {
      return res.status(401).json({
        erro: 'Usuário não autenticado.',
      });
    }

    if (!rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({
        erro: `Acesso negado (403 Forbidden): seu perfil (${req.usuario.role}) não possui permissão para realizar esta ação.`,
      });
    }

    return next();
  };
}

module.exports = checkRole;
module.exports.checkRole = checkRole;

