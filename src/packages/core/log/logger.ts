import { Subject, map, merge } from 'rxjs';
import { isDate } from 'util/types';
import { green, yellow, gray, red, cyan, magenta } from './colorize';

/**
 * When printing objects, indent each line by the width of the boilerplate string.
 */
const objectSpace = '\n' + new Array<string>(57).fill(' ').join('');

const now = () => {
    const date = new Date();
    return `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const applicationTag = green('[Resonance]');

export class NcLogger {
    $log = new Subject<any>();
    $error = new Subject<any>();
    $verbose = new Subject<any>();
    $debug = new Subject<any>();

    constructor(private _context = 'ResonanceApp') {
        this._context = yellow('[' + this._context + ']');

        this._logger$.subscribe((message) => {
            switch (message.type) {
                case 'error':
                    console.error(message.statement.join('  '));
                    break;
                case 'debug':
                    console.debug(message.statement.join('  '));
                    break;
                default:
                    console.log(message.statement.join('  '));
            }
        });
    }

    public log(...msg: any[]) {
        msg.forEach((msg) => this.$log.next(msg));
    }

    public error(...msg: any[]) {
        msg.forEach((msg) => this.$error.next(msg));
    }

    public verbose(...msg: any[]) {
        msg.forEach((msg) => this.$verbose.next(msg));
    }

    public debug(...msg: any[]) {
        msg.forEach((msg) => this.$debug.next(msg));
    }

    private _logger$ = merge(
        this.$log.pipe(
            map((log) => ({
                type: 'log',
                message: log,
                statement: [green('__LOG__')],
            }))
        ),
        this.$error.pipe(
            map((log) => ({
                type: 'error',
                message: log,
                statement: [red('_ERROR_')],
            }))
        ),
        this.$verbose.pipe(
            map((log) => ({
                type: 'verbose',
                message: log,
                statement: [cyan('VERBOSE')],
            }))
        ),
        this.$debug.pipe(
            map((log) => ({
                type: 'debug',
                message: log,
                statement: [magenta('_DEBUG_')],
            }))
        )
    ).pipe(
        map((log) => {
            log.statement.unshift(applicationTag, now());
            log.statement.push(this._context);

            if (typeof log.message === 'object') {
                if (isDate(log.message)) {
                    log.statement.push(log.message.toISOString());
                } else {
                    try {
                        log.statement.push(
                            JSON.stringify(log.message, null, 4)
                                .replace(/(\[|\]|\,)/g, gray('$1'))
                                .replace(/(\"(.){1,}\")/g, yellow('$1'))
                                .replace(/\n/g, objectSpace)
                        );
                    } catch {
                        log.statement.push(log.message);
                    }
                }
            } else {
                log.statement.push(log.message);
            }

            return log;
        })
    );
}
