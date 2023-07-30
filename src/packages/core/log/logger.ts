import { Subject, concatMap, map, merge, of } from 'rxjs';
import { isDate } from 'util/types';
import { Colorize } from './colorize';

export const $log = new Subject<any>();
export const $error = new Subject<any>();
export const $verbose = new Subject<any>();
export const $debug = new Subject<any>();

const logger = merge(
    $log.pipe(
        map((log) => ({
            type: 'log',
            message: log,
            statement: 'LOG    '
        }))
    ),
    $error.pipe(
        map((log) => ({
            type: 'error',
            message: log,
            statement: 'ERROR  '
        }))
    ),
    $verbose.pipe(
        map((log) => ({
            type: 'verbose',
            message: log,
            statement: 'VERBOSE'
        }))
    ),
    $debug.pipe(
        map((log) => ({
            type: 'debug',
            message: log,
            statement: 'DEBUG  '
        }))
    )
).pipe(
    concatMap((message) => {
        try {
            switch (typeof message.message) {
                case 'object':
                    if (isDate(message.message)) {
                        message.message = message.message.toISOString();
                        break;
                    }

                    message.message = message.message;
            }
        } catch {}

        return of(message).pipe(
            concatMap((message) =>
                of(message).pipe(
                    map((message) => {
                        const date = new Date();
                        const dateStr =
                            [
                                date.getMonth() + 1,
                                date.getDate(),
                                date.getFullYear()
                            ].join('/') +
                            ', ' +
                            [
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds()
                            ].join(':');
                        switch (message.type) {
                            case 'error':
                                return [dateStr, Colorize.red('ERROR  ')];
                            case 'verbose':
                                return [
                                    dateStr,
                                    Colorize.cyanBright('VERBOSE')
                                ];
                            case 'debug':
                                return [
                                    dateStr,
                                    Colorize.magentaBright('DEBUG  ')
                                ];
                            default:
                                return [dateStr, Colorize.green('LOG    ')];
                        }
                    })
                )
            ),
            map((logMsg) => ({
                type: message.type,
                message: [...logMsg, message.message]
            }))
        );
    })
);

export class NcLogger {
    constructor(private _context?: string) {
        logger.subscribe((message) => {
            const msg = message.message.pop();
            const toLog = [
                Colorize.green('[Resonance]'),
                ...message.message,
                Colorize.yellow('[' + this._context + ']')
            ];

            let logAsObject = false;

            if (typeof msg === 'object') {
                logAsObject = true;
            } else {
                toLog.push(msg);
            }

            switch (message.type) {
                case 'error':
                    console.error(toLog.join('   '));
                    break;
                case 'debug':
                    console.debug(toLog.join('   '));
                    break;
                default:
                    console.log(toLog.join('   '));
            }

            if (logAsObject) {
                console.log(msg);
            }
        });
    }
}
