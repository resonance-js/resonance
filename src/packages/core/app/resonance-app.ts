import { Observable, Subject } from 'rxjs';
import { Class } from '../interface/class';
import { ResonanceConfig } from './resonance-config';

import express from 'express';
import { NcLogger } from '../log/logger';
import { Server } from 'http';

new NcLogger('ResonanceApp');

export const $onBootstrap = new Subject<void>();
export const $onServerInit = new Subject<void>();

export class Resonance {
    public appRef?: any;
    private server?: Server;

    private _app = express();

    constructor(private _config: ResonanceConfig) {}

    boostrap(appModule: Class) {
        this.appRef = new appModule();
        $onBootstrap.complete();
        return this._createExpressServer();
    }

    private _createExpressServer() {
        return new Observable<string>((observer) => {
            const callback = () => {
                $onServerInit.complete();
                observer.next(
                    'Resonance is listening on port ' + this._config.port
                );
                observer.complete();
            };

            this.server =
                this._config.backlog !== undefined
                    ? this._app.listen(
                          this._config.port,
                          this._config.hostname ?? 'localhost',
                          this._config.backlog,
                          () => callback()
                      )
                    : this._app.listen(
                          this._config.port,
                          this._config.hostname ?? 'localhost',
                          () => callback()
                      );
        });
    }

    public exit() {
        return new Observable<string>((observer) => {
            if (this.server)
                this.server.close((err) => {
                    if (err) {
                        observer.error(err);
                    } else {
                        this.server?.closeAllConnections();
                        observer.next(
                            'Resonance exited for connection on port ' +
                                this._config.port
                        );
                        observer.complete();
                    }
                });
            else {
                observer.error(
                    'Failed to exit Resonance, as it was never started.'
                );
            }
        });
    }
}
