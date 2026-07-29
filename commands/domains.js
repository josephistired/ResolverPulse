const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');

const { getDomains } = require('../api/analytics');
const { errorSend } = require('../functions/error');

module.exports = {
	developer: true,
	cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('domains')
		.setDescription('View domain analytics.')
		.addStringOption((option) =>
			option
				.setName('status')
				.setDescription('Filter domains by query status.')
				.addChoices(
					{ name: 'All', value: 'all' },
					{ name: 'Default', value: 'default' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Allowed', value: 'allowed' },
				),
		)
		.addBooleanOption((option) =>
			option
				.setName('root')
				.setDescription('Group subdomains under their root domain.'),
		),

	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		await interaction.reply({
			content: 'Fetching NextDNS domain statistics...',
			flags: MessageFlags.Ephemeral,
		});

		try {
			const status = interaction.options.getString('status') || 'all';
			const root = interaction.options.getBoolean('root') ?? false;

			const domains = await getDomains(status, root);

			if (!domains || !Array.isArray(domains)) {
				throw new Error('NextDNS returned no domain information.');
			}

			if (domains.length === 0) {
				return interaction.editReply({
					content: 'No domain statistics were found for the selected filters.',
				});
			}

			const domainList = domains
				.slice(0, 20)
				.map(
					(domain, index) =>
						`**${index + 1}.** \`${
							domain.domain
						}\`\n${domain.queries.toLocaleString()} queries`,
				)
				.join('\n\n');

			const statusName = status.charAt(0).toUpperCase() + status.slice(1);

			const embed = new EmbedBuilder()
				.setTitle(`NextDNS Domains | ${statusName}`)
				.setDescription('Domain statistics for the configured NextDNS profile.')
				.setColor('White')
				.addFields(
					{
						name: 'Domains',
						value: domainList,
						inline: false,
					},
					{
						name: 'Filter',
						value: statusName,
						inline: true,
					},
					{
						name: 'Root Domains',
						value: root ? 'Enabled' : 'Disabled',
						inline: true,
					},
					{
						name: 'Results',
						value: `${Math.min(domains.length, 20)} displayed`,
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
