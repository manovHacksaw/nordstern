'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@nordstern/shared-auth';
import { Button } from '@nordstern/shared-ui';
import { Input } from '@nordstern/shared-ui';
import { Label } from '@nordstern/shared-ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@nordstern/shared-ui';
import Image from 'next/image';

// NordStern INTERNAL admin sign-in. A demo password gate (default admin / admin),
// isolated from operator + customer auth. Stand-in for the real super-admin role.
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api.post('/admin/login', { username: username.trim(), password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface relative overflow-hidden px-4">
      {/* Premium decorative background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-surface to-surface"></div>
      <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-brand/5 blur-[100px]"></div>
      <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-accent/5 blur-[100px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center rounded-2xl bg-white/5 p-3.5 shadow-sm ring-1 ring-white/10 backdrop-blur-md">
            <Image src="/logo.png" alt="NordStern Logo" width={44} height={44} className="object-contain drop-shadow-sm" />
          </div>
          <div className="text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--ff-clear-display)' }}>
            Nord<span className="text-brand">Stern</span> <span className="text-muted-foreground font-normal">Admin</span>
          </div>
        </div>
        <Card className="rounded-[1.5rem] border-line/40 bg-card/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-6 pt-8 space-y-1">
            <CardTitle className="text-center text-xl font-medium">Internal sign-in</CardTitle>
            <CardDescription className="text-center">NordStern staff only — application review & approval.</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {error && <div className="mb-6 rounded-lg bg-destructive-50 px-3 py-2 text-sm text-destructive border border-destructive/20">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-muted-foreground">Username</Label>
                <Input id="username" autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="rounded-xl h-12 bg-background/50 focus:bg-background transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className="rounded-xl h-12 bg-background/50 focus:bg-background transition-colors" />
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full rounded-xl h-12 text-sm font-medium shadow-md hover:shadow-lg transition-all" disabled={busy || !username || !password}>
                  {busy ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">Demo gate — replace with a super-admin role before production.</p>
      </div>
    </div>
  );
}
