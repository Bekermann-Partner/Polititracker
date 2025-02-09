import { SignInForm } from '@/app/auth/sign-in/SignInForm';
import { getXAuthURL } from '@/app/auth/sign-in/signInAction';

export default async function SignInPage() {
  const xAuthRedirectURL = await getXAuthURL();

  console.log(process.env);
  console.log(xAuthRedirectURL);

  return <SignInForm XRedirectURL={xAuthRedirectURL} />;
}

export const dynamic = 'force-dynamic';