const { loadCommands } = require('../../utils/commandLoader');

module.exports = {
	name: 'clientReady',
	once: true,
	async execute(client) {
		await loadCommands(client);

		client.user.setActivity(
			'Repo - https://github.com/josephistired/ResolverPulse',
		);

		console.log('\n==============================');
		console.log(`Logged in as: ${client.user.username}`);

		if (process.env.NEXTDNS_PROFILE_ID) {
			console.log(
				`Profile ID: ${process.env.NEXTDNS_PROFILE_ID}`,
			);
		}
		else {
			console.log('Profile ID: Not provided. Please add it in .env.');
		}

		console.log('==============================\n');
	},
};
