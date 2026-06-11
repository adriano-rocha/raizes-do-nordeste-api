import { Router } from 'express'
import { criarPedido, listarPedidos, buscarPedido, atualizarStatusPedido } from '../controllers/pedidos.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', autenticar, listarPedidos)
router.get('/:id', autenticar, buscarPedido)
router.post('/', autenticar, criarPedido)
router.patch('/:id/status', autenticar, autorizar('ADMIN', 'GERENTE', 'COZINHA', 'ATENDENTE'), atualizarStatusPedido)

export default router