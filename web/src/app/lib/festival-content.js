// src/app/[locale]/lib/festival-content.js
import fs from 'fs/promises'; // Use promise-based filesystem
import path from 'path';
import matter from 'gray-matter';

// Static file paths to avoid dynamic usage
const CONTENT_DIR = path.join(process.cwd(), "content", "festivals");

export async function getFestivalContent(slug, locale = "en") {
  try {
    const normalizedSlug = slug.toLowerCase();
    const localePath = path.join(CONTENT_DIR, locale);
    const fullPath = path.join(localePath, `${normalizedSlug}.md`);
    
    try {
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      return { 
        slug: normalizedSlug, 
        content, 
        ...data, 
        isFallback: false 
      };
    } catch (error) {
      // Path for English fallback
      const fallbackPath = path.join(CONTENT_DIR, "en", `${normalizedSlug}.md`);
      
      try {
        const fileContents = await fs.readFile(fallbackPath, "utf8");
        const { data, content } = matter(fileContents);
        
        return { 
          slug: normalizedSlug, 
          content, 
          ...data, 
          isFallback: true 
        };
      } catch (fallbackError) {
        console.error(`Fallback failed for ${normalizedSlug}:`, fallbackError.message);
        return null;
      }
    }
  } catch (error) {
    console.error(`Unexpected error for ${slug} in ${locale}:`, error.message);
    return null;
  }
}

// Pre-fetch available festival slugs to use for static site generation
export async function getAllFestivalSlugs() {
  try {
    const enPath = path.join(CONTENT_DIR, "en");
    const files = await fs.readdir(enPath);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error("Error fetching festival slugs:", error.message);
    return [];
  }
}

// New function to generate static paths for all festivals
export async function generateStaticParams() {
  const slugs = await getAllFestivalSlugs();
  const locales = ['en', 'np'];
  
  const params = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, festivalId: slug });
    }
  }
  
  return params;
}