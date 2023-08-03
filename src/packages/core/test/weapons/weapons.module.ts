import { NcModule } from '../../di/decorators/module.decorator';
import { WeaponsService } from './weapons.service';

@NcModule({
    baseURL: 'weapons',
    declarations: [WeaponsService],
    exports: [WeaponsService],
})
export class WeaponsModule {}