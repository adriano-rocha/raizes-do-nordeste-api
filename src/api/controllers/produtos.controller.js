import prisma from '../../infrastructure/prisma.js'

export const listarProdutos = async (req, res) => {
  const { page = 1, limit = 10 } = req.query

  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  })

  return res.status(200).json(produtos)
}

export const buscarProduto = async (req, res) => {
  const { id } = req.params

  const produto = await prisma.produto.findUnique({
    where: { id: Number(id) }
  })

  if (!produto) {
    return res.status(404).json({
      error: 'PRODUTO_NAO_ENCONTRADO',
      message: 'Produto não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  return res.status(200).json(produto)
}

export const criarProduto = async (req, res) => {
  const { nome, descricao, preco } = req.body

  if (!nome || !preco) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'Nome e preço são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const produto = await prisma.produto.create({
    data: { nome, descricao, preco: Number(preco) }
  })

  return res.status(201).json(produto)
}

export const atualizarProduto = async (req, res) => {
  const { id } = req.params
  const { nome, descricao, preco, ativo } = req.body

  const produto = await prisma.produto.findUnique({
    where: { id: Number(id) }
  })

  if (!produto) {
    return res.status(404).json({
      error: 'PRODUTO_NAO_ENCONTRADO',
      message: 'Produto não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const atualizado = await prisma.produto.update({
    where: { id: Number(id) },
    data: { nome, descricao, preco: preco ? Number(preco) : undefined, ativo }
  })

  return res.status(200).json(atualizado)
}