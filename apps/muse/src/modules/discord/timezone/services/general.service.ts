import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { isValid } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import enUS from 'date-fns/locale/en-US';
import { EmbedBuilder, Message } from 'discord.js';

@Injectable()
export class TimezoneGeneralService {
	private readonly _logger = new Logger(TimezoneGeneralService.name);

	constructor(private _prisma: PrismaService) {}

	async setTimezone(guildId: string, userId: string, timezone: string) {
		const data = await this.getTimezone(guildId, userId);
		if (data) {
			return this._prisma.timezoneData.update({
				where: {
					id: data.id,
				},
				data: {
					timezone,
				},
			});
		}

		return this._prisma.timezoneData.create({
			data: { guildId, userId, timezone },
		});
	}

	getTimezone(guildId: string, userId: string) {
		return this._prisma.timezoneData.findFirst({
			where: {
				guildId,
				userId,
			},
		});
	}

	async checkTimezonedMessage(
		message: Message,
		hour: number,
		minutes: number,
	) {
		const data = await this.getTimezone(message.guildId, message.author.id);
		if (!data) {
			return;
		}

		const date = utcToZonedTime(new Date(), data.timezone);
		date.setHours(hour);
		date.setMinutes(minutes);

		if (!isValid(date)) {
			return;
		}

		const utcDate = zonedTimeToUtc(date, data.timezone);

		if (!isValid(utcDate)) {
			return;
		}

		const embed = new EmbedBuilder()
			.setFooter({
				text: `Above time (${formatInTimeZone(
					utcDate,
					data.timezone,
					'HH:mm zzz',
					{ locale: enUS },
				)}) in your local time`,
			})
			.setTimestamp(utcDate.getTime());

		return message.channel.send({
			embeds: [embed],
		});
	}
}
