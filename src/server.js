import express from 'express'
import authRoutes from './api/routes/auth.routes.js'
import unidadesRoutes from './api/routes/unidades.routes.js'
import produtosRoutes from './api/routes/produtos.routes.js'
import estoqueRoutes from './api/routes/estoque.routes.js'
import pedidosRoutes from './api/routes/pedidos.routes.js'
import pagamentosRoutes from './api/routes/pagamentos.routes.js'
import fidelidadeRoutes from './api/routes/fidelidade.routes.js'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/unidades', unidadesRoutes)
app.use('/produtos', produtosRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/pedidos', pedidosRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/fidelidade', fidelidadeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Raízes do Nordeste API funcionando!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app