import { NcModule } from '../../di/decorators/module.decorator';
import { WeaponsModule } from '../weapons/weapons.module';
import { ForceService } from './force.service';
import { JediService } from './jedi.service';
import { SithService } from './sith.service';

@NcModule({
    baseURL: 'force-user',
    declarations: [ForceService, JediService, SithService],
    exports: [JediService, SithService],
    imports: [WeaponsModule],
})
export class ForceUserModule {}
