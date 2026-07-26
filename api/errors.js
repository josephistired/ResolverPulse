class NextDNSError extends Error {
	constructor(response) {
		const errors = response?.body?.errors || [];
		const firstError = errors[0];

		super(
			firstError?.detail ||
        NextDNSError.getStatusMessage(response?.status),
		);

		this.name = 'NextDNSError';
		this.status = response?.status || null;
		this.code = firstError?.code || null;
		this.source =
      firstError?.source?.parameter ||
      firstError?.source?.pointer ||
      null;
		this.errors = errors;
	}

	static getStatusMessage(status) {
		switch (status) {
		case 400:
			return 'The request sent to NextDNS was invalid.';

		case 401:
			return 'The NextDNS API key is missing or invalid.';

		case 403:
			return 'The NextDNS API key does not have permission to access this profile.';

		case 404:
			return 'The requested NextDNS profile could not be found.';

		case 429:
			return 'Too many requests were sent to NextDNS. Please try again later.';

		case 500:
		case 502:
		case 503:
		case 504:
			return 'NextDNS is currently unavailable.';

		default:
			return 'An unexpected NextDNS API error occurred.';
		}
	}

	static validateResponse(response) {
		if (response?.body?.errors?.length) {
			throw new NextDNSError(response);
		}

		if (!response?.body || !Object.hasOwn(response.body, 'data')) {
			throw new Error('NextDNS returned an unexpected response.');
		}

		return response.body.data;
	}

	static handle(error) {
		if (error instanceof NextDNSError) {
			throw error;
		}

		if (error.response) {
			throw new NextDNSError(error.response);
		}

		throw error;
	}
}

module.exports = NextDNSError;