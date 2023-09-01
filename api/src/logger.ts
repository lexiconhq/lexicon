import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//
// This transport will rotate files on a daily basis
// and store each file for a maximum of 14 days.
//
// The date pattern is the indicator of the frequency.
// YYYY-MM-DD means it will rotate every day.
// YYYY-MM-DD-HH meand is will rotate every hour and so on.
//
const rotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/errors-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '14d',
  level: 'error',
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new transports.File({ filename: 'logs/combined.log' }),
    rotateFileTransport,
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}
