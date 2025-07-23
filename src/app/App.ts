import express, { Application, json, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { config } from 'dotenv'
import 'reflect-metadata'

// Import routes
import { transcriptionRoutes } from './routes/transcriptionRoutes'
import { healthRoutes } from './routes/healthRoutes'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { requestLogger } from './middleware/requestLogger'
import { validateEnvironment } from './middleware/validateEnvironment'

// Load environment variables
config()

class App {
  public app: Application
  private readonly port: number

  constructor () {
    this.app = express()
    this.port = parseInt(process.env.PORT ?? '3575', 10)

    this.validateEnvironment()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private validateEnvironment (): void {
    validateEnvironment()
  }

  private initializeMiddlewares (): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }))

    // CORS configuration
    this.app.use(cors({
      origin: this.getAllowedOrigins(),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
      ],
      credentials: true,
      maxAge: 86400 // 24 hours
    }))

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per window
      message: {
        error: 'Too many requests from this IP, please try again later',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    })
    this.app.use('/api', limiter)

    // Compression
    this.app.use(compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false
        }
        return compression.filter(req, res)
      },
      threshold: 1024 // Only compress responses > 1KB
    }))

    // Body parsing
    this.app.use(json({
      limit: '10mb',
      verify: (req: any, res, buf) => {
        // Store raw body for webhook signature verification if needed
        req.rawBody = buf
      }
    }))

    this.app.use(urlencoded({
      extended: true,
      limit: '10mb'
    }))

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan(
        process.env.NODE_ENV === 'production'
          ? 'combined'
          : 'dev'
      ))
    }

    // Custom request logging
    this.app.use(requestLogger)

    // Trust proxy (for rate limiting, CORS, etc.)
    this.app.set('trust proxy', 1)
  }

  private getAllowedOrigins (): string[] {
    const origins = process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000'
    return origins.split(',').map(origin => origin.trim())
  }

  private initializeRoutes (): void {
    // Health check (no rate limiting)
    this.app.use('/health', healthRoutes)

    // API routes (with rate limiting)
    this.app.use('/api/v1/transcriptions', transcriptionRoutes)

    // Catch-all for undefined routes (use a specific handler instead of '*')
    this.app.use(notFoundHandler)
  }

  private initializeErrorHandling (): void {
    // Global error handler (must be last)
    this.app.use(errorHandler)
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`)
      console.log(`📝 Environment: ${process.env.NODE_ENV ?? 'development'}`)
      console.log(`🔗 Health check: http://localhost:${this.port}/health`)
      console.log(`🔗 API Base URL: http://localhost:${this.port}/api/v1`)
    })
  }

  public getApp (): Application {
    return this.app
  }
}

export default App
