import { Router } from 'express'
import { consultarPontos, adicionarPontos, resgatarPontos } from '../controllers/fidelidade.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', autenticar, consultarPontos)
router.post('/adicionar', autenticar, autorizar('ADMIN', 'GERENTE'), adicionarPontos)
router.post('/resgatar', autenticar, resgatarPontos)

export default router