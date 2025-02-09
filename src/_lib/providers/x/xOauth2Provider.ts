function getAuthUrl(): string {
  const authUrl = new URL('https://x.com/i/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.X_OAUTH_CLIENT!);
  authUrl.searchParams.set('redirect_uri', process.env.X_OAUTH_REDIRECT!);
  authUrl.searchParams.set('scope', 'users.read tweet.read');
  authUrl.searchParams.set('state', 'state');
  authUrl.searchParams.set('code_challenge', 'challenge');
  authUrl.searchParams.set('code_challenge_method', 'plain');

  return authUrl.toString();
}

const XOauth2Provider = {
  getAuthUrl,
};

export default XOauth2Provider;
