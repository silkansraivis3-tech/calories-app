/* global process */

import cors from 'cors'
import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})
app.post('/api/analyze-food', (request, response) => {
  const {imageName} = request.body
  if (!imageName) {
    return response.status(400).json ({
      error: 'imageName is required'
    })
  }
  response.json({
    message: 'Image received. AI analysis is not connected yet.',
    imageName
  })
})
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
