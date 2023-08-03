import { Injectable } from '../../di/decorators/injectable.decorator';

@Injectable()
export class ForceService {
    public abilities = ['jump', 'push', 'pull', 'speed'];

    constructor() {}
}