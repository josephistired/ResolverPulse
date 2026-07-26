const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');

const { getStatus } = require('../api/analytics');
const { errorSend } = require('../functions/error');

module.exports = {
	developer: true,
	cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('View NextDNS query statistics.'),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.reply({
			content: 'Fetching NextDNS statistics...',
			flags: MessageFlags.Ephemeral,
		});

		try {
			const stats = await getStatus();

			if (!stats || !Array.isArray(stats)) {
				throw new Error('NextDNS returned no statistics information.');
			}

			const defaultQueries =
				stats.find((item) => item.status === 'default')?.queries || 0;

			const blockedQueries =
				stats.find((item) => item.status === 'blocked')?.queries || 0;

			const allowedQueries =
				stats.find((item) => item.status === 'allowed')?.queries || 0;

			const relayedQueries =
				stats.find((item) => item.status === 'relayed')?.queries || 0;

			const totalQueries =
				defaultQueries +
				blockedQueries +
				allowedQueries +
				relayedQueries;

			const blockRate =
				totalQueries > 0
					? ((blockedQueries / totalQueries) * 100).toFixed(2)
					: '0.00';

			const embed = new EmbedBuilder()
				.setTitle('NextDNS Statistics')
				.setDescription(
					'DNS query statistics for the configured NextDNS profile.',
				)
				.setColor('White')
				.addFields(
					{
						name: 'Overview',
						value:
							`Total Queries: **${totalQueries.toLocaleString()}**\n` +
							`Block Rate: **${blockRate}%**`,
						inline: false,
					},
					{
						name: 'Default',
						value: defaultQueries.toLocaleString(),
						inline: true,
					},
					{
						name: 'Blocked',
						value: blockedQueries.toLocaleString(),
						inline: true,
					},
					{
						name: 'Allowed',
						value: allowedQueries.toLocaleString(),
						inline: true,
					},
					{
						name: 'Relayed',
						value: relayedQueries.toLocaleString(),
						inline: true,
					},
				)
				.setFooter({
					text: 'ResolverPulse | Powered by the NextDNS API',
				})
				.setTimestamp();

			return interaction.editReply({
				content: '',
				embeds: [embed],
			});
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