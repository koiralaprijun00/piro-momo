import AuthForm from '@/components/AuthForm';

export default async function AuthPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ mode?: string }>
}) {
  const { locale } = await params;
  const { mode } = await searchParams;
  const defaultMode = mode === 'signup' ? 'signup' : 'signin';
  
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <AuthForm locale={locale} defaultMode={defaultMode} />
    </div>
  );
}
