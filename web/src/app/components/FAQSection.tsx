import Script from "next/script";

const faqs = [
  { 
    question: "What is Binod Chaudhary’s net worth?", 
    answer: "As of 2024, Binod Chaudhary has a net worth of $1.8 billion." 
  },
  { 
    question: "How did he get rich?", 
    answer: "His wealth primarily comes from Wai Wai noodles and investments in hospitality, banking, and real estate." 
  },
  { 
    question: "Is Binod Chaudhary Nepal’s richest person?", 
    answer: "Yes, he is Nepal’s only billionaire and the richest person in the country." 
  },
  { 
    question: "What businesses does CG Corp Global own?", 
    answer: "CG Corp operates in food & beverages, hospitality, banking, real estate, and energy across 30 countries." 
  },
  { 
    question: "Is Binod Chaudhary involved in philanthropy?", 
    answer: "Yes, he has donated millions for education, healthcare, and disaster relief in Nepal." 
  }
];

export default function FAQSection() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script type="application/ld+json" id="faq-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(({ question, answer }) => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          }))
        })}
      </Script>

      {/* Visible FAQ Section */}
      <section className="mb-8 px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b pb-2">
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="space-y-4 text-gray-700">
          {faqs.map(({ question, answer }, index) => (
            <div key={index} className="border-b pb-4">
              <p className="font-bold">{question}</p>
              <p className="text-gray-600 mt-1">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
