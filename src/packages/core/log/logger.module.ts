import { NcModule } from '../di/decorators/module.decorator';
import { NcLogger } from './logger.service';

@NcModule({
    declarations: [NcLogger],
    exports: [NcLogger],
})
export class NcLoggerModule {}
