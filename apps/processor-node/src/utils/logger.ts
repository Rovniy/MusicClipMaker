/**
 * Represents the logging levels available for a logging system.
 *
 * Each level corresponds to a specific severity of log message:
 * - 'debug': Used for detailed debugging information.
 * - 'info': Used for general informational messages.
 * - 'warn': Used to indicate potentially problematic situations.
 * - 'error': Used to represent errors or critical issues.
 */
type LoggerLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger object for managing log messages with configurable levels and prefixes.
 *
 * Provides methods to log messages at various severity levels - debug, info, warn, error.
 * Allows configuring log prefix and checks if logging is enabled for specific levels based on the current log level.
 *
 * Properties:
 * - `prefix`: The string prefix used in all log messages.
 * - `level`: The logging level threshold that controls message visibility. Defaults to 'debug'.
 *
 * Methods:
 * - `configure(prefix: string)`: Configures the prefix for the logger.
 * - `isLogEnabled(level: LoggerLevel): boolean`: Determines if logging is enabled for the specified level based on the current log threshold.
 * - `debug(...args: any[]): void`: Logs messages with 'debug' level if debug logging is enabled.
 * - `info(...args: any[]): void`: Logs messages with 'info' level if info logging is enabled.
 * - `warn(...args: any[]): void`: Logs messages with 'warn' level if warn logging is enabled.
 * - `error(...args: any[]): void`: Logs messages with 'error' level if error logging is enabled.
 */
const Logger = {
    prefix: 'NODE_PROCESSOR',
    level: (process.env.LOGGER_LEVEL as LoggerLevel) || 'debug', // Default to 'debug'

    configure(prefix: string) {
        this.prefix = prefix;
    },

    isLogEnabled(level: LoggerLevel): boolean {
        const levels: LoggerLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    },

    debug(...args: any[]): void {
        if (this.isLogEnabled('debug')) {
            console.debug(`[${this.prefix}]`, ...args);
        }
    },

    info(...args: any[]): void {
        if (this.isLogEnabled('info')) {
            console.info(`[${this.prefix}]`, ...args);
        }
    },

    warn(...args: any[]): void {
        if (this.isLogEnabled('warn')) {
            console.warn(`[${this.prefix}]`, ...args);
        }
    },

    error(...args: any[]): void {
        if (this.isLogEnabled('error')) {
            console.error(`[${this.prefix}]`, ...args);
        }
    }
};

export default Logger;