import { SignInForm } from '@/app/auth/sign-in/SignInForm';
import { getAuthUrl } from '@/_lib/providers/x/xOauth2Provider';

export default async function SignInPage() {
  const xAuthRedirectURL = await getAuthUrl();

  return <SignInForm XRedirectURL={xAuthRedirectURL} />;
}
