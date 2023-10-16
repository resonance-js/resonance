import { Server } from 'http';
import { request } from './request';

import express from 'express';

describe('HttpService', () => {
    let testServer: Server;

    beforeAll((done) => {
        const expressServer = express();

        // @ts-ignore
        expressServer.get('/api/test', (req, res) => {
            res.send(
                JSON.stringify({
                    hello: 'world'
                })
            );
        });

        // @ts-ignore
        expressServer.delete('/api/test', (req, res) => {
            res.send(
                JSON.stringify({
                    hello: 'world'
                })
            );
        });

        // @ts-ignore
        expressServer.patch('/api/test', (req, res) => {
            res.send(
                JSON.stringify({
                    hello: 'world'
                })
            );
            res.end();
        });

        // @ts-ignore
        expressServer.post('/api/test', (req, res) => {
            res.send(
                JSON.stringify({
                    hello: 'world'
                })
            );
            res.end();
        });

        testServer = expressServer.listen(3001, () => {
            done();
        });
    });

    afterAll((done) => {
        testServer.close();
        done();
    });

    test('Can place `get` request', (done) => {
        request<any>('GET', {
            hostname: 'localhost',
            protocol: 'http',
            port: 3001,
            path: ['api', 'test'],
            encoding: 'utf-8',
            parse: true
        }).subscribe({
            next: (val) => {
                expect(typeof val).toEqual('object');
                expect('hello' in val).toEqual(true);
            },
            error: (err) => {
                throw err;
            },
            complete: () => {
                expect(true).toEqual(true);
                done();
            }
        });
    });

    // test('Can place `get` request, expected error', (done) => {
    //     httpService
    //         .get({
    //             host: 'localhost',
    //             port: 3001,
    //             path: ['api']
    //         })
    //         .subscribe({
    //             error: (err) => {
    //                 expect(typeof err).toEqual('object');
    //                 expect(err.statusCode).toEqual(500);
    //                 done();
    //             }
    //         });
    // });
});
