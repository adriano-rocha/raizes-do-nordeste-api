import prisma from '../../infrastructure/prisma.js'

export const listarUnidades = async (req, res) => {
  const unidades = await prisma.unidade.findMany({
    where: { ativa: true }
  })

  return res.status(200).json(unidades)
}

export const buscarUnidade = async (req, res) => {
  const { id } = req.params

  const unidade = await prisma.unidade.findUnique({
    where: { id: Number(id) }
  })

  if (!unidade) {
    return res.status(404).json({
      error: 'UNIDADE_NAO_ENCONTRADA',
      message: 'Unidade não encontrada.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  return res.status(200).json(unidade)
}

export const criarUnidade = async (req, res) => {
  const { nome, endereco } = req.body

  if (!nome || !endereco) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'Nome e endereço são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const unidade = await prisma.unidade.create({
    data: { nome, endereco }
  })

  return res.status(201).json(unidade)
}

export const atualizarUnidade = async (req, res) => {
  const { id } = req.params
  const { nome, endereco, ativa } = req.body

  const unidade = await prisma.unidade.findUnique({
    where: { id: Number(id) }
  })

  if (!unidade) {
    return res.status(404).json({
      error: 'UNIDADE_NAO_ENCONTRADA',
      message: 'Unidade não encontrada.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const atualizada = await prisma.unidade.update({
    where: { id: Number(id) },
    data: { nome, endereco, ativa }
  })

  return res.status(200).json(atualizada)
}