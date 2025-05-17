// src/logger.ts
import { Logging } from '@google-cloud/logging'

type LoggerLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

const LEVEL_PRIORITY: Record<LoggerLevel, number> = {
	DEBUG: 0,
	INFO: 1,
	WARNING: 2,
	ERROR: 3,
}

const MIN_LEVEL = (
    (process.env.LOGGER_LEVEL || 'INFO').toUpperCase() as LoggerLevel
)

const LOG_NAME = process.env.LOG_NAME || 'PROCESSOR_NODE'

const loggingClient = new Logging()
const log = loggingClient.log(LOG_NAME)

function shouldLog(level: LoggerLevel) {
	return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL]
}

/**
 * Core write function.
 * - level: Cloud Logging severity
 * - message: either a string or an object payload
 * - meta: additional fields to attach
 */
function write(
	level: LoggerLevel,
	message: string | object,
	meta: Record<string, any> = {}
) {
	if (!shouldLog(level)) return

	// build an entry with correct severity
	const entry = log.entry(
		{ severity: level },
		typeof message === 'string'
			? { message, ...meta }
			: { ...message, ...meta }
	)

	// async fire-and-forget
	log.write(entry).catch((err) => {
		// fallback to console if Cloud Logging write fails
		console.error('[Logger] failed to write entry:', err)
	})
}

const Logger = {
	debug: (msg: string | object, meta?: Record<string, any>) =>
		write('DEBUG', msg, meta),
	info: (msg: string | object, meta?: Record<string, any>) =>
		write('INFO', msg, meta),
	warn: (msg: string | object, meta?: Record<string, any>) =>
		write('WARNING', msg, meta),
	error: (msg: string | object, meta?: Record<string, any>) =>
		write('ERROR', msg, meta),
}

export default Logger
