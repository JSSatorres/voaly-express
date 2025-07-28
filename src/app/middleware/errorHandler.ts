import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  console.error('🚨 Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // Handle known HTTP errors
  if (error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    })
    return
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: error.message,
        code: 400,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    })
    return
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON format',
        code: 400,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    })
    return
  }

  // Handle MongoDB/Mongoose errors
  if (error.name === 'MongoError' || error.name === 'MongooseError') {
    res.status(500).json({
      success: false,
      error: {
        message: 'Database error',
        code: 500,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    })
    return
  }

  // Default error response
  const statusCode = 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    }
  })
}
