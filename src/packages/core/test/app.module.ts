import { NcModule } from '../di/decorators/module.decorator';
import { ForceUserModule } from './force-user/force-user.module';
import { WeaponsModule } from './weapons/weapons.module';

@NcModule({
    baseURL: 'api',
    imports: [ForceUserModule, WeaponsModule],
})
export class AppModule {
    constructor() {}
}
