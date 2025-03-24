
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations("Translations"); 

  return (
    <main className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 ">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-200 dark:bg-pink-700 opacity-20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-yellow-200 dark:bg-yellow-700 opacity-20 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-purple-200 dark:bg-purple-700 opacity-20 rounded-full animate-float-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-orange-200 dark:bg-orange-700 opacity-20 rounded-full animate-float-slower"></div>
      </div>
      
      <div className="relative z-10 container mx-auto flex flex-col items-center px-4">
        {/* Header Section - Enhanced with animation */}
        <div className="py-1 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-600 dark:to-red-600 rounded-full blur-lg opacity-60 scale-100 animate-pulse"></div>
            <Image 
              src="/images/momo-header.png" 
              alt="Piromomo Logo" 
              width={160} 
              priority={true}
              height={160} 
              className="relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <h1 className="mt-0 text-3xl sm:text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
            {t('piromomo')} {/* Fixed: No need for 'homepage.piromomo' */}
          </h1>
          <p className="mt-3 text-center text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">
            <span className="inline-block animate-bounce-light delay-100">{t('tagline')}</span>
          </p>
        </div>

        {/* Fun Card Section - Improved layout for all screen sizes */}
        <div className="w-full my-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {/* Spend Binod Chaudhary's Money Card */}
          <Link href="/spend" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-3xl">
            <div className="relative px-6 py-12 h-full bg-gradient-to-br from-purple-600 to-pink-500 dark:from-purple-700 dark:to-pink-600 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1 transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-yellow-500 animate-pulse">💰</span>
                <span>{t('billionaireBadge')}</span>
              </div>
              
              {/* Main content */}
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:from-yellow-300 group-hover:to-yellow-500 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">$</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t('spendBinodTitle')}</h2>
                  <p className="mt-1 text-white text-opacity-90">{t('spendBinodDescription')}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Guess the Festival Card */}
          <Link href="/guess-festival" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-orange-300 rounded-3xl">
            <div className="relative px-6 py-12 h-full bg-gradient-to-br from-orange-500 to-yellow-400 dark:from-orange-600 dark:to-yellow-500 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-yellow-100 text-orange-600 font-bold text-xs py-1 px-3 rounded-full shadow-md transform -rotate-2 hover:rotate-0 transition-transform flex items-center gap-1">
                <span className="text-sm animate-pulse">✨</span>
                <span>{t('quizBadge')}</span>
              </div>
              
              {/* Main content */}
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="/festival-header.jpg"
                      alt="Festival Celebration"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t('games.guessFestival.title')}</h2> {/* Fixed: Access nested key */}
                  <p className="mt-1 text-white text-opacity-90">{t('games.guessFestival.description')}</p> {/* Fixed: Access nested key */}
                </div>
              </div>
            </div>
          </Link>

          {/* Kings of Nepal Card - NEW */}
          <Link href="/kings-of-nepal" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl">
            <div className="relative px-6 py-12 h-full bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-blue-700 dark:to-indigo-600 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1 transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-yellow-500 animate-pulse">👑</span>
                <span>{t('kingsOfNepal.badge')}</span>
              </div>
              
              {/* Main content */}
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="/kings-of-nepal.jpg" 
                      alt="Kings of Nepal"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t('kingsOfNepal.title')}</h2>
                  <p className="mt-1 text-white text-opacity-90">{t('kingsOfNepal.description')}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/name-districts" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl">
            <div className="relative px-6 py-12 h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1 transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-sm animate-pulse">🗺️</span>
                <span>{t('geography')}</span>
              </div>
              
              {/* Main content */}
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:from-blue-300 group-hover:to-indigo-400 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">📍</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm"> {t('nameDistrictTitle')} </h2>
                  <p className="mt-1 text-white text-opacity-90">{t('nameDistrictDescription')}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/life-checklist" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-green-300 rounded-3xl">
            <div className="relative px-6 py-12 h-full bg-gradient-to-br from-green-500 to-teal-400 dark:from-green-600 dark:to-teal-500 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1 transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-sm animate-pulse">✅</span>
                <span>{t('bucket')}</span>
              </div>
              
              {/* Main content */}
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-teal-500 group-hover:from-green-300 group-hover:to-teal-400 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">📝</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t('nepalChecklist.navbarTitle')}</h2>
                  <p className="mt-1 text-white text-opacity-90">{t('nepalChecklist.description')}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Nepal GK Quiz Card */}
<Link href="/general-knowledge" className="block transform transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl">
  <div className="relative px-6 py-12 h-full bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
    {/* Badge */}
    <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold text-xs py-1 px-3 rounded-full shadow-md flex items-center gap-1 transform -rotate-2 hover:rotate-0 transition-transform">
      <span className="text-yellow-500 animate-pulse">🧠</span>
      <span>{t('quizBadge')}</span>
    </div>
    
    {/* Main content */}
    <div className="flex items-center relative z-10">
      <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-md mr-4 group-hover:shadow-lg transition-all duration-300">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-300 to-indigo-400 group-hover:from-blue-200 group-hover:to-indigo-300 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">❓</span>
        </div>
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">{t('nepalGk.titleshort') || 'Nepal General Knowledge Quiz'}</h2>
        <p className="mt-1 text-white text-opacity-90">{t('nepalGk.shortdescription') || 'Test your knowledge about Nepal with this quiz!'}</p>
      </div>
    </div>
  </div>
</Link>
          
        </div>

        {/* Content Separator with visual element */}
        <div className="w-full flex justify-center my-8">
          <div className="relative w-3/4 max-w-md h-1 bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-500 to-transparent">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
              <span className="text-2xl">🍜</span>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}