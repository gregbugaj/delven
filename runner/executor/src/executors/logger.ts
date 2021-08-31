
import * as fs from "fs"
import * as path from "path"

const winston = require('winston');
const { createLogger, addColors } = require('winston');
const logform = require('logform');
const { combine, timestamp, label, printf, colorize } = logform.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
class LogContainer {
  get: (name: any) => any;
  loggers: any;
  transports: any;

  constructor(transports: any) {
    this.transports = transports;
    this.loggers = {};

    addColors({
      info: 'bold blue',
      warn: 'italic yellow',
      error: 'bold red',
      debug: 'green'
    });

    this.get = (name) => {
      if (!this.loggers[name]) {
        const logger = createLogger({
          transports: this.transports,
          levels: levels,
          exitOnError: false,
          json: true,
          defaultMeta: { service: 'user-service' },
          format: combine(
            colorize({
              all: true
            }),
            label({ label: name }),
            timestamp({
              format: "YY-MM-DD HH:MM:SS.SSS"
            }),
            printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)),
        });

        logger.id = name;
        this.loggers[name] = logger;
      }

      return this.loggers[name];
    };
  };
}

const LoggerMap = new Map()
export default class LoggerFactory {

  /**
   * Create new logger
   * Return a logger named according to the name parameter.
   * @param name
   */
  static createLogger(name: string, options: {
    logsDirPath: string,
    logLevel: string,
  }): any {

    if (LoggerMap.has(name)) {
      return LoggerMap[name]
    }

    const { logsDirPath, logLevel } = options
    const dir = logsDirPath || './logs/';
    const serviceDir = path.join(dir, "/", name)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir);
    }

    const fileName = path.resolve(path.join(serviceDir, `${name}.log`))
    const fileNameError = path.resolve(path.join(serviceDir, `${name}.errors.log`));

    const transports = [
      new (winston.transports.File)({
        filename: fileName,
        handleExceptions: true,
        json: true,
        level: logLevel ? logLevel : 'debug',
        maxsize: 5242880, //5MB
        maxFiles: 5,
        eol: '\n', // for Windows, or `eol: '\n',` for *NIX OSs
        timestamp: true
      }),

      new (winston.transports.File)({
        name: 'error-file',
        filename: fileNameError,
        handleExceptions: true,
        json: true,
        level: 'warn',
        maxsize: 5242880, //5MB
        maxFiles: 5,
      }),

      new (winston.transports.Console)({
        stderrLevels: ['error'],
        prettyPrint: true,
        colorize: true,
        timestamp: true,
      })
    ]

    LoggerMap[name] = new LogContainer(transports);
    return LoggerMap[name].get(name)
  }

  static getLogger(name: string) {
    if (!LoggerMap.has(name)) {
      throw new Error(`Logger has not yet been created : ${name}`)
    }
    return LoggerMap[name].get(name)
  }

}
