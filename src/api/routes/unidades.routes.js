import { Router } from 'express'
import { listarUnidades, buscarUnidade, criarUnidade, atualizarUnidade } from '../controllers/unidades.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /unidades:
 *   get:
 *     summary: Listar unidades ativas
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades
 */
router.get('/', autenticar, listarUnidades)

/**
 * @swagger
 * /unidades/{id}:
 *   get:
 *     summary: Buscar unidade por ID
 *     tags: [Unidades]
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
 *         description: Unidade encontrada
 *       404:
 *         description: Unidade não encontrada
 */
router.get('/:id', autenticar, buscarUnidade)

/**
 * @swagger
 * /unidades:
 *   post:
 *     summary: Criar unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unidade criada
 *       422:
 *         description: Dados inválidos
 */
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), criarUnidade)

/**
 * @swagger
 * /unidades/{id}:
 *   put:
 *     summary: Atualizar unidade
 *     tags: [Unidades]
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
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               ativa:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Unidade atualizada
 *       404:
 *         description: Unidade não encontrada
 */
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), atualizarUnidade)

export default router