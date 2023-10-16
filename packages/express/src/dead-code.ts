// private _initializeRoutes(routes: Class<route_ref>[] = []) {
//         if (routes.length === 0) return of('No routes to initialize.');

//         return forkJoin(
//             routes.map((routeRef, index) => {
//                 const routeName = routeRef.prototype.name;
//                 const route = RouteCatalog.get(routeName);

//                 if (route === undefined) {
//                     throw new Error(
//                         `Failed to initialize route ${routeName} for module ${this.name} at index ${index}. ` +
//                             `Did you decorate ${routeName} with @Route()?`
//                     );
//                 }

//                 return route.onInit$.pipe(
//                     map(() => {
//                         this.routes.set(routeName, route);
//                     })
//                 );
//             })
//         );
//     }

//     import {
//     Server as SecureServer,
// } from 'https';
// import { Server } from 'http';

//     private _applicationRoutes: string[] = [];

//     public router!: NgRouter;

//     private _resolveRoutes(modules?: Map<string, Module>) {
//         this.router = new NgRouter(this.appRef.baseURL);

//         (modules ?? this.appRef.imports).forEach((ncModule: Module) => {
//             ncModule.routes.forEach((route) => {
//                 this._applicationRoutes.push(route.name);
//             });

//             if (Object.keys(ncModule.imports).length > 0) {
//                 this._resolveRoutes(ncModule.imports);
//             }
//         });
//     }

//         private _initializeServer() {
//         return new Observable<string>((observer) => {
//             const callback = () => {
//                 observer.next(
//                     green(
//                         'Resonance is listening on port ' +
//                             this._config.port +
//                             '.'
//                     )
//                 );
//                 observer.complete();
//             };

//             this.router.initializeRoutes(this._applicationRoutes);

//             this.router.appExpress.get(
//                 '/api',
//                 // @ts-ignore
//                 (req: Request, res: Response) => {
//                     res.status(200).write(
//                         JSON.stringify({
//                             welcome: 'to Jurassic Park.',
//                             i_mean: 'Resonance.',
//                             welcome_to: 'Resonance.',
//                         })
//                     );
//                     res.end();
//                 }
//             );

//             const server = this._config.credentials
//                 ? createSecureServer(this.router.appExpress)
//                 : createServer(this.router.appExpress);

//             this.appServer =
//                 this._config.backlog !== undefined
//                     ? server.listen(
//                           this._config.port,
//                           this._config.hostname ?? 'localhost',
//                           this._config.backlog,
//                           () => callback()
//                       )
//                     : server.listen(
//                           this._config.port,
//                           this._config.hostname ?? 'localhost',
//                           () => callback()
//                       );
//         }).pipe(
//             tap((msg) => {
//                 console.log(msg);
//             })
//         );
//     }

//     public exit() {
//         return new Observable<string>((observer) => {
//             if (this.appServer)
//                 this.appServer.close((err) => {
//                     if (err) {
//                         observer.error(err);
//                     } else {
//                         this.appServer?.closeAllConnections();
//                         observer.next(
//                             'Resonance exited for connection on port ' +
//                                 this._config.port
//                         );
//                         observer.complete();
//                     }
//                 });
//             else {
//                 observer.error(
//                     'Failed to exit Resonance, as it was never started.'
//                 );
//             }
//         });
//     }
