import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Context, SlashCommandContext, Subcommand } from 'necord';

import { MusicEnabledGuard } from '../guards/enabled.guard';
import { MusicService } from '../services';

import {
	MusicCommandDecorator,
	MusicInVoiceGuard,
	NotInVoiceExceptionFilter,
} from '@music';

import { EnabledExceptionFilter } from '@util';

@UseGuards(MusicEnabledGuard, MusicInVoiceGuard)
@UseFilters(EnabledExceptionFilter, NotInVoiceExceptionFilter)
@MusicCommandDecorator()
export class MusicPreviousCommands {
	private readonly _logger = new Logger(MusicPreviousCommands.name);

	constructor(private _music: MusicService) {}

	@Subcommand({
		name: 'previous',
		description: 'Play the previous song in the queue',
	})
	public async previous(@Context() [interaction]: SlashCommandContext) {
		return this._music.previous(interaction);
	}
}
