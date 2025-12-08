// src/app/[locale]/lib/festival-content.ts
import fs from 'fs/promises'; // Use promise-based filesystem
import path from 'path';
import matter from 'gray-matter';

// Static file paths to avoid dynamic usage
const CONTENT_DIR = path.join(process.cwd(), "content", "festivals");

interface FestivalContent {
  slug: string;
  content: string;
  isFallback: boolean;
  [key: string]: any;
}

export async function getFestivalContent(slug: string, locale: string = "en"): Promise<FestivalContent | null> {
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
      } catch (fallbackError: any) {
        console.error(`Fallback failed for ${normalizedSlug}:`, fallbackError.message);
        return null;
      }
    }
  } catch (error: any) {
    console.error(`Unexpected error for ${slug} in ${locale}:`, error.message);
    return null;
  }
}

// Pre-fetch available festival slugs to use for static site generation
export async function getAllFestivalSlugs(): Promise<string[]> {
  try {
    const enPath = path.join(CONTENT_DIR, "en");
    const files = await fs.readdir(enPath);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error: any) {
    console.error("Error fetching festival slugs:", error.message);
    return [];
  }
}

// New function to generate static paths for all festivals
export async function generateStaticParams(): Promise<{ locale: string; festivalId: string }[]> {
  const slugs = await getAllFestivalSlugs();
  const locales = ['en', 'np'];
  
  const params: { locale: string; festivalId: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, festivalId: slug });
    }
  }
  
  return params;
}
