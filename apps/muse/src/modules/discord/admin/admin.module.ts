import { Module } from '@nestjs/common';

import { SharedModule } from '@muse';

import { AdminPurgeCommands } from './commands/purge.commands';
import { AdminUtilsCommands } from './commands/util.commands';
import { AdminPurgeService } from './services/purge.service';

@Module({
	imports: [SharedModule],
	controllers: [],
	providers: [AdminUtilsCommands, AdminPurgeCommands, AdminPurgeService],
})
export class AdminModule {}
