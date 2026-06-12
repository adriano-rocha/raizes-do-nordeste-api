import { Router } from 'express'
import { processarPagamento } from '../controllers/pagamentos.controller.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Processar pagamento mock
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: integer
 *               metodo:
 *                 type: string
 *                 enum: [MOCK, PIX, CARTAO]
 *     responses:
 *       200:
 *         description: Pagamento processado
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Pedido já processado
 *       422:
 *         description: Dados inválidos
 */
router.post('/', autenticar, processarPagamento)

export default router