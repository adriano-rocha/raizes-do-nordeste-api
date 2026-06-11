import express from 'express'
import authRoutes from './api/routes/auth.routes.js'
import unidadesRoutes from './api/routes/unidades.routes.js'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/unidades', unidadesRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Raízes do Nordeste API funcionando!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app