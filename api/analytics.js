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

	static async getDomains(status, root) {
		try {
			let url = `https://api.nextdns.io/profiles/${process.env.NEXTDNS_PROFILE_ID}/analytics/domains`;

			const params = [];

			if (status && status !== 'all') {
				params.push(`status=${status}`);
			}

			if (root !== null && root !== undefined) {
				params.push(`root=${root}`);
			}

			if (params.length > 0) {
				url += `?${params.join('&')}`;
			}

			const response = await superagent
				.get(url)
				.set('X-Api-Key', process.env.NEXTDNS_API_KEY)
				.set('Accept', 'application/json');

			return NextDNSError.validateResponse(response);
		}
		catch (error) {
			NextDNSError.handle(error);
		}
	}

	static async getReasons() {
		try {
			const response = await superagent
				.get(
					`https://api.nextdns.io/profiles/${process.env.NEXTDNS_PROFILE_ID}/analytics/reasons`,
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