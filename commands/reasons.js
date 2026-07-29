const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');

const { getReasons } = require('../api/analytics');
const { errorSend } = require('../functions/error');

module.exports = {
	developer: true,
	cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('reasons')
		.setDescription('View blocking reason analytics.'),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		await interaction.reply({
			content: 'Fetching NextDNS blocking reason statistics...',
			flags: MessageFlags.Ephemeral,
		});

		try {
			const reasons = await getReasons();

			if (!reasons || !Array.isArray(reasons)) {
				throw new Error('NextDNS returned no blocking reason statistics.');
			}

			const reasonList = reasons
				.slice(0, 20)
				.map(
					(id, index) =>
						`**${index + 1}.** \`${
							id.name
						}\`\n${id.queries.toLocaleString()} queries`,
				)
				.join('\n\n');

			const embed = new EmbedBuilder()
				.setTitle('NextDNS Blocking Reasons')
				.setDescription('Blocking reason statistics for the configured NextDNS profile.')
				.setColor('White')
				.addFields(
					{
						name: 'Blocking Reasons',
						value: reasonList,
						inline: false,
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
