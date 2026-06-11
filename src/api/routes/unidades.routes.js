import { Router } from 'express'
import { listarUnidades, buscarUnidade, criarUnidade, atualizarUnidade } from '../controllers/unidades.controller.js'
import { autenticar, autorizar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', autenticar, listarUnidades)
router.get('/:id', autenticar, buscarUnidade)
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), criarUnidade)
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), atualizarUnidade)

export default router