const superagent = require('superagent');
const NextDNSError = require('./errors');

class AnalyticsAPI {
	static async getStatus() {
		try {
			const response = await superagent
				.get(
					`https://api.nextdns.io/profiles/${process.env.NEXTDNS_PROFILE_ID}/analytics/status`,
				)
				.set('X-Api-Key', process.env.NEXTDNS_API_KEY)
				.set('Accept', 'application/json');

			return NextDNSError.validateResponse(response);
		}
		catch (error) {
			NextDNSError.handle(error);
		}
	}
}

module.exports = AnalyticsAPI;