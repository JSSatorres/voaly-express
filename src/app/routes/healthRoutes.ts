import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Vocali Express API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

router.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  })
})

export { router as healthRoutes }
