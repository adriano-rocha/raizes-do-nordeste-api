import { Router } from 'express'
import { consultarEstoque, entradaEstoque } from '../controllers/estoque.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /estoque/{unidadeId}:
 *   get:
 *     summary: Consultar estoque por unidade
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unidadeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estoque da unidade
 */
router.get('/:unidadeId', autenticar, consultarEstoque)

/**
 * @swagger
 * /estoque:
 *   post:
 *     summary: Entrada de estoque
 *     tags: [Estoque]
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
 *               produtoId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estoque atualizado
 *       422:
 *         description: Dados inválidos
 */
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), entradaEstoque)

export default router