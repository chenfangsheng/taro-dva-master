import {
  formatTime
} from './common'

const defaults = {
  level: 'log',
  logger: console,
  logErrors: true,
  colors: {
    title: 'inherit',
    req: '#9E9E9E',
    res: '#4CAF50',
    error: '#F20404',
  }
}

function printBuffer(logEntry, options) {
  const {
    logger,
    colors
  } = options;

  let {
    title,
    started,
    req,
    res
  } = logEntry

  // Message
  const headerCSS = ['color: gray; font-weight: lighter;']
  const styles = s => `color: ${s}; font-weight: bold`

  // render
  logger.group(`%c ${title} @${formatTime(started)}`, ...headerCSS)
  logger.log('%c req', styles(colors.req), req)
  logger.log('%c res', styles(colors.res), res)
  logger.groupEnd()
}

interface LogEntry {
  started?: object // 触发时间
}

function createLogger(options: LogEntry = {}) {
  const loggerOptions = Object.assign({}, defaults, options)
  const logEntry = options
  logEntry.started = new Date()
  printBuffer(logEntry, Object.assign({}, loggerOptions))
}

export {
  defaults,
  createLogger,
}
