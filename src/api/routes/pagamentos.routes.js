import { Router } from 'express'
import { processarPagamento } from '../controllers/pagamentos.controller.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', autenticar, processarPagamento)

export default router