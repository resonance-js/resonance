import { Catalog } from '../../core';
import { Injectable } from '../../core/src/di/injectable';
import { Class } from '../../core/src/interface/class';
import { route_ref } from './controller.decorator';
import { Schema } from './schema';

export const ControllerCatalog = new Catalog<string, Controller<any>>();

export class Controller<T> extends Injectable {
    constructor(instance: Class<route_ref>, path: string, schema: Schema<T>[]) {
        super(instance);
        console.log(instance, path, schema);
    }
}
