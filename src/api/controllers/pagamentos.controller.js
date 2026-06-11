import prisma from '../../infrastructure/prisma.js'

export const processarPagamento = async (req, res) => {
  const { pedidoId, metodo } = req.body

  if (!pedidoId || !metodo) {
    return res.status(422).json({
      error: 'DADOS_INVALIDOS',
      message: 'pedidoId e metodo são obrigatórios.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const pedido = await prisma.pedido.findUnique({ where: { id: Number(pedidoId) } })

  if (!pedido) {
    return res.status(404).json({
      error: 'PEDIDO_NAO_ENCONTRADO',
      message: 'Pedido não encontrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {
    return res.status(409).json({
      error: 'PEDIDO_JA_PROCESSADO',
      message: 'Este pedido já foi processado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  const pagamentoExistente = await prisma.pagamento.findUnique({ where: { pedidoId: Number(pedidoId) } })

  if (pagamentoExistente) {
    return res.status(409).json({
      error: 'PAGAMENTO_JA_EXISTE',
      message: 'Este pedido já possui um pagamento registrado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }

  // Simulação mock: aprova 80% das vezes, recusa 20%
  const aprovado = Math.random() > 0.2

  const statusPagamento = aprovado ? 'APROVADO' : 'RECUSADO'
  const statusPedido = aprovado ? 'EM_PREPARO' : 'CANCELADO'

  const pagamento = await prisma.pagamento.create({
    data: {
      pedidoId: Number(pedidoId),
      metodo,
      status: statusPagamento,
      payload: {
        transacaoId: `MOCK-${Date.now()}`,
        valor: Number(pedido.total),
        status: statusPagamento,
        processadoEm: new Date().toISOString()
      }
    }
  })

  await prisma.pedido.update({
    where: { id: Number(pedidoId) },
    data: { status: statusPedido }
  })

  await prisma.logAuditoria.create({
    data: {
      usuarioId: req.usuario.id,
      acao: 'PROCESSAR_PAGAMENTO',
      detalhes: `Pagamento do pedido ${pedidoId} - Status: ${statusPagamento}`
    }
  })

  return res.status(200).json({
    pagamentoId: pagamento.id,
    pedidoId: Number(pedidoId),
    status: statusPagamento,
    statusPedido,
    metodo,
    valor: Number(pedido.total),
    payload: pagamento.payload
  })
}