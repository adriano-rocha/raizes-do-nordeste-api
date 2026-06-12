import { Router } from 'express'
import { listarProdutos, buscarProduto, criarProduto, atualizarProduto } from '../controllers/produtos.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Listar produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista de produtos
 */
router.get('/', autenticar, listarProdutos)

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
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
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', autenticar, buscarProduto)

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Criar produto
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado
 *       422:
 *         description: Dados inválidos
 */
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), criarProduto)

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), atualizarProduto)

export default router