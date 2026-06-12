import { Router } from 'express'
import { criarPedido, listarPedidos, buscarPedido, atualizarStatusPedido } from '../controllers/pedidos.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadeId:
 *                 type: integer
 *               canalPedido:
 *                 type: string
 *                 enum: [APP, TOTEM, WEB, BALCAO, PICKUP]
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *               formaPagamento:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       404:
 *         description: Unidade ou produto não encontrado
 *       409:
 *         description: Estoque insuficiente
 *       422:
 *         description: Dados inválidos
 */
router.post('/', autenticar, criarPedido)

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos com filtros
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: canalPedido
 *         schema:
 *           type: string
 *           enum: [APP, TOTEM, WEB, BALCAO, PICKUP]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/', autenticar, listarPedidos)

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', autenticar, buscarPedido)

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [EM_PREPARO, PRONTO, ENTREGUE, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       404:
 *         description: Pedido não encontrado
 *       422:
 *         description: Status inválido
 */
router.patch('/:id/status', autenticar, autorizar('ADMIN', 'GERENTE', 'COZINHA', 'ATENDENTE'), atualizarStatusPedido)

export default router