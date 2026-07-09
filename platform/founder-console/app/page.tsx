import { redirect } from 'next/navigation';

// register.nordstern.live entry point = the public founder application wizard.
// (The authed console lives at /overview; returning founders reach it via /login.)
export default function RootPage() {
  redirect('/register');
}
