import prisma from '../../infrastructure/prisma.js'

export const consultarPontos = async (req, res) => {
  const usuarioId = req.usuario.id

  let fidelidade = await prisma.fidelidade.findUnique({
    where: { usuarioId }
  })

  if (!fidelidade) {
    fidelidade = await prisma.fidelidade.create({
      data: { usuarioId, pontos: 0 }
    })
  }

  return res.status(200).json(fidelidade)
}

export const adicionarPontos = async (req, res) => {
  const { usuarioId, pontos } = req.body

  if (!usuarioId || !pontos) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'usuarioId e pontos são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } })

  if (!usuario) {
    return res.status(404).json({
      error: 'USUARIO_NAO_ENCONTRADO',
      message: 'Usuário não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const fidelidadeExistente = await prisma.fidelidade.findUnique({
    where: { usuarioId: Number(usuarioId) }
  })

  let fidelidade

  if (fidelidadeExistente) {
    fidelidade = await prisma.fidelidade.update({
      where: { usuarioId: Number(usuarioId) },
      data: { pontos: fidelidadeExistente.pontos + Number(pontos) }
    })
  } else {
    fidelidade = await prisma.fidelidade.create({
      data: { usuarioId: Number(usuarioId), pontos: Number(pontos) }
    })
  }

  return res.status(200).json(fidelidade)
}

export const resgatarPontos = async (req, res) => {
  const usuarioId = req.usuario.id
  const { pontos } = req.body

  if (!pontos) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'pontos é obrigatório.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const fidelidade = await prisma.fidelidade.findUnique({ where: { usuarioId } })

  if (!fidelidade || fidelidade.pontos < Number(pontos)) {
    return res.status(409).json({
      error: 'PONTOS_INSUFICIENTES',
      message: 'Pontos insuficientes para resgate.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const atualizado = await prisma.fidelidade.update({
    where: { usuarioId },
    data: { pontos: fidelidade.pontos - Number(pontos) }
  })

  return res.status(200).json(atualizado)
}