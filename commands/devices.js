const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');

const { Pagination } = require('@discordx/pagination');
const { getDevices } = require('../api/analytics');
const { errorSend } = require('../functions/error');

module.exports = {
	developer: true,
	cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('devices')
		.setDescription('View device analytics.'),

	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		try {
			const devices = await getDevices();

			if (!devices || !Array.isArray(devices)) {
				throw new Error('NextDNS returned no device information.');
			}

			if (devices.length === 0) {
				return interaction.reply({
					content: 'No device analytics were found.',
					flags: MessageFlags.Ephemeral,
				});
			}

			const configuredLimit = parseInt(process.env.DISCORD_DEVICE_EMBED_LIMIT, 10);

			const devicesPerPage =
					Number.isInteger(configuredLimit) && configuredLimit > 0
						? Math.min(configuredLimit, 10)
						: 10;
			const pages = [];

			for (let index = 0; index < devices.length; index += devicesPerPage) {
				const pageDevices = devices.slice(index, index + devicesPerPage);

				const deviceList = pageDevices
					.map((device, deviceIndex) => {
						const position = index + deviceIndex + 1;

						return (
							`**${position}. ${device.name || 'Unnamed Device'}**\n` +
              `Model: ${device.model || 'Unknown'}\n` +
              `Queries: ${device.queries.toLocaleString()}\n` +
              `Local IP: ${device.localIp || 'Unavailable'}`
						);
					})
					.join('\n\n');

				const embed = new EmbedBuilder()
					.setTitle('NextDNS Devices')
					.setDescription(
						'Device analytics for the configured NextDNS profile.',
					)
					.setColor('White')
					.addFields({
						name: 'Devices',
						value: deviceList,
					})
					.setFooter({
						text:
              `ResolverPulse | Page ${pages.length + 1} of ` +
              `${Math.ceil(devices.length / devicesPerPage)}`,
					})
					.setTimestamp();

				pages.push({
					embeds: [embed],
				});
			}

			// Suppress the deprecation warning because the third-party pagination library
			// still uses the deprecated ephemeral response option instead of MessageFlags.
			const pagination = new Pagination(interaction, pages, {
				ephemeral: true,
				time: 120000,
			});

			return pagination.send();
		}
		catch (err) {
			return errorSend(
				{
					user: interaction.user.tag,
					command: interaction.commandName,
					time: Math.floor(Date.now() / 1000),
					error: err.message,
					status: err.status,
					code: err.code,
					source: err.source,
				},
				interaction,
			);
		}
	},
};
