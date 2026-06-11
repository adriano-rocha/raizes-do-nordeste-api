import { Router } from 'express'
import { consultarEstoque, entradaEstoque } from '../controllers/estoque.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/:unidadeId', autenticar, consultarEstoque)
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), entradaEstoque)

export default router