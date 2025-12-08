'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Extract locale from pathname
  const currentLocale = pathname.startsWith('/np') ? 'np' : 'en';
  
  const switchLocale = () => {
    const nextLocale = currentLocale === 'en' ? 'np' : 'en';
    
    // Get the path without the locale prefix
    let newPathname = pathname;
    if (pathname.startsWith('/en') || pathname.startsWith('/np')) {
      newPathname = pathname.substring(3); // Remove locale prefix
    }
    
    // If pathname is empty after removing locale, use root path
    if (!newPathname) newPathname = '/';
    
    startTransition(() => {
      router.push(`/${nextLocale}${newPathname}`);
    });
  };

  return (
    <button
    onClick={switchLocale}
    disabled={isPending}
    className=" px-4 py-2 box-border border-b border-t border-l border-r hover:border-red-700 border-red-200 text-red-500 hover:text-orange-700 text-xs font-medium rounded-md shadow-md hover:shadow-4xl transition-all duration-300"
  >
    <span>
      {currentLocale === 'en' ? 'नेपाली' : 'English'}
      {isPending && <span className="ml-2 inline-block animate-spin">⟳</span>}
    </span>
  </button>
  );
}