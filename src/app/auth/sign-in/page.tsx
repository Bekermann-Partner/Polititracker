import { SignInForm } from '@/app/auth/sign-in/SignInForm';
import XOauth2Provider from '@/_lib/providers/x/xOauth2Provider';

export default function SignInPage() {
  const xAuthRedirectURL = XOauth2Provider.getAuthUrl();

  return <SignInForm XRedirectURL={xAuthRedirectURL} />;
}
