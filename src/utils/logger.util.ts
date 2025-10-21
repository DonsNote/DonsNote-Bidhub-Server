/**
 * Logger Utility
 * 간단한 로깅 시스템 (Winston 없이)
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(level, message, meta);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  // HTTP 요청 로깅
  http(method: string, url: string, statusCode: number, duration: number): void {
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      this.error(message);
    } else if (statusCode >= 400) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }

  // 데이터베이스 쿼리 로깅
  database(operation: string, table: string, duration?: number): void {
    const message = `DB ${operation} on ${table}${duration ? ` - ${duration}ms` : ''}`;
    this.debug(message);
  }
}

// 싱글톤 인스턴스
export const logger = new Logger();
