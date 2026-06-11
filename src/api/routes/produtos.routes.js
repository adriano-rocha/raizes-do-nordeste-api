import { Router } from 'express'
import { listarProdutos, buscarProduto, criarProduto, atualizarProduto } from '../controllers/produtos.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', autenticar, listarProdutos)
router.get('/:id', autenticar, buscarProduto)
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), criarProduto)
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), atualizarProduto)

export default router