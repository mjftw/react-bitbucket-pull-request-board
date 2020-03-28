export default function getEnv() {
    const env = {
        bitbucket: {
            oauthClientId: 'rN6C9PzUsHhcprwKSW',
            apiBaseUrl: 'https://api.bitbucket.org/2.0',
            oauthUrl: null,
            accessToken: null,
            workspaceName: '',
            repoNameSuggestions: []
        }
    }
    env.bitbucket.oauthUrl = `https://bitbucket.org/site/oauth2/authorize` +
        `?client_id=${env.bitbucket.oauthClientId}&response_type=token`

    return env;
}