const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');

const { getProfile } = require('../api/profile');
const { errorSend } = require('../functions/error');

module.exports = {
	developer: true,
	cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('View information about the configured NextDNS profile.'),

	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		await interaction.reply({
			content: 'Fetching NextDNS profile information...',
			flags: MessageFlags.Ephemeral,
		});

		try {
			const profile = await getProfile();

			if (!profile) {
				throw new Error('NextDNS returned no profile information.');
			}

			const activeAllowlistEntries =
        profile.allowlist?.filter((entry) => entry.active).length ?? 0;

			const activeDenylistEntries =
        profile.denylist?.filter((entry) => entry.active).length ?? 0;

			const activeSecurityFeatures = Object.entries(profile.security ?? {})
				.filter(([, value]) => value === true)
				.length;

			const retentionDays = profile.settings?.logs?.retention
				? Math.round(profile.settings.logs.retention / 86400)
				: 0;

			const location =
        profile.settings?.logs?.location?.toUpperCase() || 'Not configured';

			const embed = new EmbedBuilder()
				.setTitle(profile.name || 'NextDNS Profile')
				.setDescription('Configuration summary for the active NextDNS profile.')
				.setColor('White')
				.addFields(
					{
						name: 'General',
						value:
              `Profile ID: \`${profile.id || 'Unknown'}\`\n` +
              `Fingerprint: \`${profile.fingerprint}\``,
						inline: false,
					},
					{
						name: 'Setup',
						value:
              `IPv4 Servers: ${profile.setup?.ipv4?.length ?? 0}\n` +
              `IPv6 Servers: ${profile.setup?.ipv6?.length ?? 0}\n` +
              `Linked IP: ${
              	profile.setup?.linkedIp?.ip ? 'Configured' : 'Not configured'
              }\n`,
						inline: true,
					},
					{
						name: 'Security',
						value:
              `Enabled Features: ${activeSecurityFeatures}\n` +
              `Threat Intelligence: ${formatBoolean(
              	profile.security?.threatIntelligenceFeeds,
              )}\n` +
              `AI Threat Detection: ${formatBoolean(
              	profile.security?.aiThreatDetection,
              )}\n` +
              `Safe Browsing: ${formatBoolean(
              	profile.security?.googleSafeBrowsing,
              )}\n` +
              `DNS Rebinding: ${formatBoolean(
              	profile.security?.dnsRebinding,
              )}`,
						inline: true,
					},
					{
						name: 'Privacy',
						value:
              `Blocklists: ${profile.privacy?.blocklists?.length ?? 0}\n` +
              `Native Protections: ${profile.privacy?.natives?.length ?? 0}\n` +
              `Disguised Trackers: ${formatBoolean(
              	profile.privacy?.disguisedTrackers,
              )}\n` +
              `Affiliate Links: ${
              	profile.privacy?.allowAffiliate ? 'Allowed' : 'Blocked'
              }`,
						inline: true,
					},
					{
						name: 'Logging',
						value:
              `Logging: ${formatBoolean(profile.settings?.logs?.enabled)}\n` +
              `Retention: ${
              	retentionDays ? `${retentionDays} days` : 'Not configured'
              }\n` +
              `Location: ${location}`,
						inline: true,
					},
					{
						name: 'Performance',
						value:
              `EDNS Client Subnet: ${formatBoolean(
              	profile.settings?.performance?.ecs,
              )}\n` +
              `Cache Boost: ${formatBoolean(
              	profile.settings?.performance?.cacheBoost,
              )}\n` +
              `CNAME Flattening: ${formatBoolean(
              	profile.settings?.performance?.cnameFlattening,
              )}`,
						inline: true,
					},
					{
						name: 'Lists',
						value:
              `Allowlist: ${activeAllowlistEntries} active\n` +
              `Denylist: ${activeDenylistEntries} active\n` +
              `Rewrites: ${profile.rewrites?.length ?? 0}`,
						inline: true,
					},
					{
						name: 'Additional Settings',
						value:
              `Block Page: ${formatBoolean(
              	profile.settings?.blockPage?.enabled,
              )}\n` +
              `SafeSearch: ${formatBoolean(
              	profile.parentalControl?.safeSearch,
              )}\n` +
              `YouTube Restricted Mode: ${formatBoolean(
              	profile.parentalControl?.youtubeRestrictedMode,
              )}\n` +
              `Web3: ${formatBoolean(profile.settings?.web3)}`,
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

function formatBoolean(value) {
	return value ? 'Enabled' : 'Disabled';
}
