/*
    A log wrapper for the winston 3.x logger
    This is based on existing comm app, but it has been modified for our needs
    Upgraded to 3.x

    https://github.com/winstonjs/winston
    https://stackoverflow.com/questions/51012150/winston-3-0-colorize-whole-output-on-console

    HOW TO :
    1) Require the logger type of your choice or the default one:
        let logger = require('logger.js').default('MY_MODULE_NAME');

    2) Log away!
       * Logger retured is the native Winston Logger
       * All loggers types will report to console no matter the type
       * Logging functions use the string interpolation provided by WINSTON : https://www.npmjs.com/package/winston#string-interpolation
       * The following functions are available:

            logger(level, message)
            logger.fatal(message)
            logger.error(message)
            logger.warn(message)
            logger.info(message)
            logger.debug(message)
            logger.trace(message)
*/
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { createLogger, format, transports, addColors } = require('winston');
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


let logsDirPath;
let serviceFolderName;
let serviceSubTask = "";
let fileLogger;
let serviceLogLevel;

const LogContainer = function (transports) {
    this._transports = transports;
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
                transports: this._transports,
                levels: levels,
                exitOnError: false,
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

        this.loggers[name].request = request.bind(this, this.loggers[name]);
        return this.loggers[name];
    };
};

function initLoggers() {
    let dir = logsDirPath || './logs/';
    let serviceName = serviceFolderName || 'unkown-service';
    let serviceDir = `${dir}${serviceName}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir);
    }

    let fileName = path.join(serviceDir, `${serviceName}${serviceSubTask ? ("-" + serviceSubTask) : ""}.log`);
    let fileNameError = path.join(serviceDir, `${serviceName}${serviceSubTask ? ("-" + serviceSubTask) : ""}.errors.log`);

    let transports = [
        new (winston.transports.File)({
            filename: fileName,
            handleExceptions: true,
            json: true,
            level: serviceLogLevel ? serviceLogLevel : 'debug',
            maxsize: 5242880, //5MB
            maxFiles: 5,

            eol: '\n', // for Windows, or `eol: '\n',` for *NIX OSs
            timestamp: true
        }),

        new (winston.transports.File)({
            name: 'error-file',
            filename: fileNameError,
            handleExceptions: true,
            json: false,
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

    if (fileLogger) {
        for (let logger in fileLogger.loggers) {
            fileLogger.loggers[logger].transports.file = transports[0];
            fileLogger.loggers[logger].transports['error-file'] = transports[1];
            fileLogger.loggers[logger].transports.console = transports[2];
        }

        fileLogger._transports = transports;
    } else {
        fileLogger = new LogContainer(transports);
    }
}

function getDefaultLogger(category) {
    return getFileLogger(category);
}

function getFileLogger(category) {
    if (!category) {
        throw new Error('Please specify logger category');
    }

    if (!fileLogger) {
        initLoggers();
    }

    return fileLogger.get(category);
}

function defineLogsPath(logsPath, serviceName, subTask, logLevel) {
    logsDirPath = logsPath;
    serviceFolderName = serviceName;
    serviceSubTask = subTask;
    serviceLogLevel = logLevel;

    initLoggers();
}

module.exports = {
    define: defineLogsPath,
    default: getDefaultLogger, // Returns the defualt logger type
    file: getFileLogger, // Returns a file logger
    init: initLoggers
};
