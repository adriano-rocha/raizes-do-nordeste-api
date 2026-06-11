import prisma from '../../infrastructure/prisma.js'

export const criarPedido = async (req, res) => {
  const { unidadeId, canalPedido, itens, formaPagamento } = req.body
  const usuarioId = req.usuario.id

  if (!unidadeId || !canalPedido || !itens || !formaPagamento) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'unidadeId, canalPedido, itens e formaPagamento são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const canaisValidos = ['APP', 'TOTEM', 'WEB', 'BALCAO', 'PICKUP']
  if (!canaisValidos.includes(canalPedido)) {
    return res.status(422).json({
      error: 'CANAL_INVALIDO',
      message: `canalPedido deve ser um dos valores: ${canaisValidos.join(', ')}`,
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const unidade = await prisma.unidade.findUnique({ where: { id: Number(unidadeId) } })
  if (!unidade) {
    return res.status(404).json({
      error: 'UNIDADE_NAO_ENCONTRADA',
      message: 'Unidade não encontrada.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  let total = 0
  const itensComPreco = []

  for (const item of itens) {
    const produto = await prisma.produto.findUnique({ where: { id: Number(item.produtoId) } })

    if (!produto) {
      return res.status(404).json({
        error: 'PRODUTO_NAO_ENCONTRADO',
        message: `Produto ${item.produtoId} não encontrado.`,
        details: [],
        timestamp: new Date().toISOString(),
        path: req.path
      })
    }

    const estoque = await prisma.estoque.findUnique({
      where: { unidadeId_produtoId: { unidadeId: Number(unidadeId), produtoId: Number(item.produtoId) } }
    })

    if (!estoque || estoque.quantidade < item.quantidade) {
      return res.status(409).json({
        error: 'ESTOQUE_INSUFICIENTE',
        message: 'Não há quantidade suficiente para um ou mais itens.',
        details: [{ field: `itens[${item.produtoId}].quantidade`, issue: `Disponível: ${estoque ? estoque.quantidade : 0}` }],
        timestamp: new Date().toISOString(),
        path: req.path
      })
    }

    total += Number(produto.preco) * Number(item.quantidade)
    itensComPreco.push({ produtoId: Number(item.produtoId), quantidade: Number(item.quantidade), precoUnitario: Number(produto.preco) })
  }

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId,
      unidadeId: Number(unidadeId),
      canalPedido,
      total,
      itens: { create: itensComPreco }
    },
    include: { itens: true }
  })

  for (const item of itensComPreco) {
    await prisma.estoque.update({
      where: { unidadeId_produtoId: { unidadeId: Number(unidadeId), produtoId: item.produtoId } },
      data: { quantidade: { decrement: item.quantidade } }
    })
  }

  await prisma.logAuditoria.create({
    data: { usuarioId, acao: 'CRIAR_PEDIDO', detalhes: `Pedido ${pedido.id} criado via ${canalPedido}` }
  })

  return res.status(201).json(pedido)
}

export const listarPedidos = async (req, res) => {
  const { canalPedido, status, page = 1, limit = 10 } = req.query

  const where = {}
  if (canalPedido) where.canalPedido = canalPedido
  if (status) where.status = status

  const pedidos = await prisma.pedido.findMany({
    where,
    include: { itens: true, pagamento: true },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  })

  return res.status(200).json(pedidos)
}

export const buscarPedido = async (req, res) => {
  const { id } = req.params

  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: { itens: true, pagamento: true }
  })

  if (!pedido) {
    return res.status(404).json({
      error: 'PEDIDO_NAO_ENCONTRADO',
      message: 'Pedido não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  return res.status(200).json(pedido)
}

export const atualizarStatusPedido = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const statusValidos = ['EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO']
  if (!statusValidos.includes(status)) {
    return res.status(422).json({
      error: 'STATUS_INVALIDO',
      message: `Status deve ser um dos valores: ${statusValidos.join(', ')}`,
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } })

  if (!pedido) {
    return res.status(404).json({
      error: 'PEDIDO_NAO_ENCONTRADO',
      message: 'Pedido não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const atualizado = await prisma.pedido.update({
    where: { id: Number(id) },
    data: { status }
  })

  await prisma.logAuditoria.create({
    data: { usuarioId: req.usuario.id, acao: 'ATUALIZAR_STATUS_PEDIDO', detalhes: `Pedido ${id} atualizado para ${status}` }
  })

  return res.status(200).json(atualizado)
}