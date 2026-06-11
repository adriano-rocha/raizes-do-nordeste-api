import prisma from '../../infrastructure/prisma.js'

export const consultarEstoque = async (req, res) => {
  const { unidadeId } = req.params

  const estoque = await prisma.estoque.findMany({
    where: { unidadeId: Number(unidadeId) },
    include: { produto: true }
  })

  return res.status(200).json(estoque)
}

export const entradaEstoque = async (req, res) => {
  const { unidadeId, produtoId, quantidade } = req.body

  if (!unidadeId || !produtoId || !quantidade) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'unidadeId, produtoId e quantidade são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const estoqueExistente = await prisma.estoque.findUnique({
    where: { unidadeId_produtoId: { unidadeId: Number(unidadeId), produtoId: Number(produtoId) } }
  })

  let estoque

  if (estoqueExistente) {
    estoque = await prisma.estoque.update({
      where: { unidadeId_produtoId: { unidadeId: Number(unidadeId), produtoId: Number(produtoId) } },
      data: { quantidade: estoqueExistente.quantidade + Number(quantidade) }
    })
  } else {
    estoque = await prisma.estoque.create({
      data: { unidadeId: Number(unidadeId), produtoId: Number(produtoId), quantidade: Number(quantidade) }
    })
  }

  return res.status(200).json(estoque)
}