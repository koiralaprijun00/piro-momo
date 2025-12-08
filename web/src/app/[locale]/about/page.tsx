import React from "react";
import Link from "next/link";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Piromomo - Interactive Nepal Games & Quizzes | Learn Nepali Culture Online</title>
        <meta name="description" content="Discover Nepal's culture, history, and geography through fun interactive games. Test your knowledge of Nepali festivals, kings, districts, landmarks, and more with Piromomo." />
        <meta name="keywords" content="Nepal games online, Nepali cultural games, Nepal quiz games, interactive Nepal experiences, Nepali educational games, Nepal festivals quiz, Nepal geography games, Nepali history quizzes, learn Nepali culture" />
        <link rel="canonical" href="https://piromomo.com/about" />
        <meta property="og:title" content="About Piromomo - Interactive Nepal Games & Quizzes" />
        <meta property="og:description" content="Piromomo offers an interactive platform to learn about Nepal's rich culture, history, and geography through engaging games. Perfect for Nepalis and global learners." />
        <meta property="og:url" content="https://piromomo.com/about" />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Nepal Through Nepali Eyes</h1>
          <p className="text-xl text-gray-600">Finally, games about Nepal that don't confuse "momo" with "Momoss"!</p>
        </header>

        <section className="prose prose-lg max-w-none text-left">
          <p>
            Welcome to Piromomo – where we celebrate Nepali heritage with fun, interactive games that let you learn more about Nepal's culture, history, geography, and traditions. Whether you're a Nepali abroad or someone curious about this beautiful country, Piromomo offers an engaging platform to explore Nepal's rich legacy and contemporary culture.
          </p>
          <p>
            Created by Nepalis, for everyone, our mission is to share our culture authentically, without the overused "mystical Himalayan kingdom" stereotypes. Yes, we have breathtaking mountains, but we also have a thriving modern society, a rich cultural history, and a food culture that will leave you craving more. 
          </p>

          <h2 id="nepali-games-online">Games That Make Your Parents Proud (Finally)</h2>
          <p>
            Remember when Ama and Buwa said gaming was a waste of time? Well, with Piromomo, it's a different story! Our interactive games are designed not only to be fun but also to enrich your understanding of Nepal's fascinating culture, history, and people. Play games that teach you about Nepal's rich history, culture, and geography – all while enjoying yourself.
          </p>
          <p>
            Try <Link href="/spend" aria-label="Play Spend Binod Chaudhary's Money game">Spend Binod Chaudhary's Money</Link> – a one-of-a-kind game where you get to pretend you're Nepal's only billionaire. Buy a fleet of electric buses or invest in Nepal's growing hydropower sector. Get a feel for Nepal's economic challenges and opportunities in a fun way!
          </p>

          <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Festival Quiz: For When Your Foreign Friends Ask "What's Dashain?"</h3>
              <p className="text-gray-700">Instead of a long-winded explanation, send your friends our festival quiz to help them understand why we throw colored powder at each other and why goats get nervous around Dashain!</p>
              <Link href="/guess-festival" className="text-blue-600 hover:text-blue-800 font-medium" aria-label="Try Guess the Festival quiz game">Discover Dashain and Tihar →</Link>
            </div>
            
            <div className="bg-orange-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kings of Nepal: More Dramatic Than Your Favorite TV Serial</h3>
              <p className="text-gray-700">Explore Nepal's royal history without having to dig through dusty old history books. Test your knowledge of the Shah dynasty and its colorful monarchs who shaped the nation.</p>
              <Link href="/kings-of-nepal" className="text-blue-600 hover:text-blue-800 font-medium" aria-label="Play Kings of Nepal game">Challenge Yourself →</Link>
            </div>
          </div>

          <h2 id="nepal-general-knowledge">General Knowledge That Would Impress Even Your Know-It-All Uncle</h2>
          <p>
            Our <Link href="/general-knowledge" aria-label="Play Nepal General Knowledge Quiz">Nepal General Knowledge Quiz</Link> is the perfect tool for you to become the most knowledgeable person in the room. Perfect for impressing your relatives with obscure facts about Nepal that no one else knows.
          </p>
          <p>
            Whether you're preparing for exams or just want to impress your friends, our quiz covers everything from historical landmarks to modern-day trivia about Nepal.
          </p>

          <h2 id="nepal-geography-games">District Knowledge Without Memorizing the Map</h2>
          <p>
            Get to know Nepal's districts with our <Link href="/name-districts" aria-label="Play Name Districts geography game">Name Districts</Link> game. It's an interactive way to familiarize yourself with Nepal's 77 districts, their locations, and unique features – no boring memorization required!
          </p>

          <div className="my-8 bg-orange-100 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Perfect For:</h3>
            <p className="text-blue-700">
              Nepalis abroad, students preparing for exams, and anyone wanting to brush up on their knowledge of Nepal's geography, history, and cultural heritage. 
            </p>
          </div>

          <h2 id="nepali-cultural-education">NRNs: Test If You're Still Nepali Enough</h2>
          <p>
            Whether you're a Nepali living abroad or just curious, Piromomo helps you reconnect with Nepal's heritage. Our <Link href="/first-of-nepal" aria-label="Explore Firsts of Nepal feature">Firsts of Nepal</Link> feature highlights pioneering Nepalis who achieved remarkable firsts, helping you stay connected with your roots and share this knowledge with others.
          </p>

          <h2 id="nepali-life-experiences">Before You Die: The Ultimate Nepal Experiences</h2>
          <p>
            From surviving a chaotic Dashain rush to trekking in the Himalayas, check off items from our <Link href="/life-checklist" aria-label="View Nepal Life Checklist">Nepal Life Checklist</Link> and see how many authentic Nepali experiences you've had. It's the definitive list of what every Nepali needs to experience at least once in their lifetime.
          </p>

          <h2 id="mobile-friendly-nepal-games">Mobile-Friendly For Load-Shedding Entertainment</h2>
          <p>
            Piromomo's games work smoothly on mobile devices, ensuring you can enjoy them anytime, whether during load-shedding or waiting for your tea. Our platform is built with accessibility in mind, so you can learn about Nepal no matter where you are or how much data you have.
          </p>

          <h2 id="about-piromomo">Why We Created Piromomo</h2>
          <p>
            We got tired of seeing Nepal reduced to just Mount Everest and Buddha's birthplace. Nepal is so much more than that! From our delicious momo dumplings to our lively jatras and festivals, Nepal is full of surprises. Our mission is to share this diversity through interactive games and quizzes that both educate and entertain.
          </p>
          <p>
            With Piromomo, we aim to preserve and promote Nepali culture in a way that's accessible to everyone—from Nepalis living abroad to foreigners who want to understand our heritage better.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-left text-gray-600">
        <p>Crafted with passion, humor, and a deep love for Nepal, Piromomo is created by Nepalis who wanted to make learning about our rich culture and history as engaging as a friendly debate over the best football team.</p>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;
