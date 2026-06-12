import { Router } from 'express'
import { consultarPontos, adicionarPontos, resgatarPontos } from '../controllers/fidelidade.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /fidelidade:
 *   get:
 *     summary: Consultar pontos do usuário logado
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pontos do usuário
 */
router.get('/', autenticar, consultarPontos)

/**
 * @swagger
 * /fidelidade/adicionar:
 *   post:
 *     summary: Adicionar pontos ao usuário
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               pontos:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pontos adicionados
 *       404:
 *         description: Usuário não encontrado
 *       422:
 *         description: Dados inválidos
 */
router.post('/adicionar', autenticar, autorizar('ADMIN', 'GERENTE'), adicionarPontos)

/**
 * @swagger
 * /fidelidade/resgatar:
 *   post:
 *     summary: Resgatar pontos do usuário logado
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pontos:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pontos resgatados
 *       409:
 *         description: Pontos insuficientes
 *       422:
 *         description: Dados inválidos
 */
router.post('/resgatar', autenticar, resgatarPontos)

export default router