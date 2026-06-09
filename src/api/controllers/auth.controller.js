import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../infrastructure/prisma.js'

export const register = async (req, res) => {
  const { nome, email, senha, role } = req.body

  if (!nome || !email || !senha) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'Nome, email e senha são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const usuarioExiste = await prisma.usuario.findUnique({ where: { email } })

  if (usuarioExiste) {
    return res.status(409).json({
      error: 'EMAIL_JA_CADASTRADO',
      message: 'Este e-mail já está em uso.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash, role: role || 'CLIENTE' }
  })

  return res.status(201).json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role
  })
}

export const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'Email e senha são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (!usuario) {
    return res.status(401).json({
      error: 'CREDENCIAIS_INVALIDAS',
      message: 'E-mail ou senha inválidos.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha)

  if (!senhaValida) {
    return res.status(401).json({
      error: 'CREDENCIAIS_INVALIDAS',
      message: 'E-mail ou senha inválidos.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  return res.status(200).json({
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: 28800,
    user: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    }
  })
}