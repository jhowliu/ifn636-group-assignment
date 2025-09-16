class BaseHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  async handle(request, response, next) {
    if (this.canHandle(request)) {
      try {
        await this.process(request, response);

        if (this.nextHandler && !response.headersSent) {
          return this.nextHandler.handle(request, response, next);
        }

        if (!response.headersSent && next) {
          next();
        }
      } catch (error) {
        if (this.nextHandler && this.canContinueOnError(error)) {
          return this.nextHandler.handle(request, response, next);
        }
        throw error;
      }
    } else if (this.nextHandler) {
      return this.nextHandler.handle(request, response, next);
    } else if (next) {
      next();
    }
  }

  canHandle(request) {
    throw new Error('canHandle method must be implemented by subclasses');
  }

  async process(request, response) {
    throw new Error('process method must be implemented by subclasses');
  }

  canContinueOnError(error) {
    return false;
  }

  sendError(response, statusCode, message) {
    if (!response.headersSent) {
      response.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = BaseHandler;