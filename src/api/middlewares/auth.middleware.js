import jwt from 'jsonwebtoken'

export const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'NAO_AUTENTICADO',
      message: 'Token não fornecido.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'TOKEN_INVALIDO',
      message: 'Token inválido ou expirado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }
}

export const autorizar = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        error: 'SEM_PERMISSAO',
        message: 'Você não tem permissão para acessar este recurso.',
        details: [],
        timestamp: new Date().toISOString(),
        path: req.path
      })
    }
    next()
  }
}