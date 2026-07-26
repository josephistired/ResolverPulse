const superagent = require('superagent');
const NextDNSError = require('./errors');

class ProfileAPI {
	static async getProfile() {
		try {
			const response = await superagent
				.get(
					`https://api.nextdns.io/profiles/${process.env.NEXTDNS_PROFILE_ID}`,
				)
				.set('X-Api-Key', process.env.NEXTDNS_API_KEY)
				.set('Accept', 'application/json');

			return NextDNSError.validateResponse(response);
		}
		catch (error) {
			NextDNSError.handle(error);
		}
	}

	// static async deleteProfile() {

	// }
}

module.exports = ProfileAPI;