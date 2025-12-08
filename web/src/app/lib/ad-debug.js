// src/app/lib/ad-debug.js

/**
 * Utility functions to debug AdSense loading issues
 * Add this to your project and import it in pages where ads aren't showing
 */

/**
 * Check if AdSense is properly initialized
 * Call this in the browser console to troubleshoot
 */
export function checkAdSenseStatus() {
    console.log('--- AdSense Status Check ---');
    
    // Check if the AdSense script is loaded
    const adScript = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    console.log('AdSense script loaded:', !!adScript);
    
    // Check if window.adsbygoogle is defined
    console.log('window.adsbygoogle defined:', typeof window.adsbygoogle !== 'undefined');
    
    // Check if any adsbygoogle slots are present
    const adSlots = document.querySelectorAll('.adsbygoogle');
    console.log('AdSense slots found:', adSlots.length);
    
    // Check if any ad containers are hidden or have zero dimensions
    const hiddenAds = Array.from(adSlots).filter(ad => {
      const styles = window.getComputedStyle(ad);
      return styles.display === 'none' || 
             styles.visibility === 'hidden' || 
             ad.offsetWidth === 0 || 
             ad.offsetHeight === 0;
    });
    console.log('Hidden or zero-sized ad slots:', hiddenAds.length);
    
    // Log ad containers with their dimensions
    console.log('Ad containers with dimensions:');
    adSlots.forEach((ad, index) => {
      console.log(`Ad ${index + 1}:`, {
        width: ad.offsetWidth,
        height: ad.offsetHeight,
        visible: window.getComputedStyle(ad).display !== 'none'
      });
    });
    
    // Check for ad blockers (simple check)
    setTimeout(() => {
      const adsBlocked = adSlots.length > 0 && !document.querySelector('iframe[id^="google_ads_iframe"]');
      console.log('Possible ad blocker detected:', adsBlocked);
    }, 2000);
    
    console.log('------------------------');
    
    return {
      scriptLoaded: !!adScript,
      adsbygoogleDefined: typeof window.adsbygoogle !== 'undefined',
      adSlotsCount: adSlots.length,
      hiddenAdsCount: hiddenAds.length
    };
  }
  
  /**
   * Log events related to AdSense loading
   * Call this early in your page to capture ad loading events
   */
  export function monitorAdSenseEvents() {
    // Store original method
    const originalPush = Array.prototype.push;
    
    // Override to monitor adsbygoogle.push calls
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        console.log('Page loaded, checking AdSense status in 2 seconds...');
        setTimeout(checkAdSenseStatus, 2000);
      });
      
      // Create adsbygoogle array if it doesn't exist
      window.adsbygoogle = window.adsbygoogle || [];
      
      // Override push method to log calls
      window.adsbygoogle.push = function(...args) {
        console.log('adsbygoogle.push called with:', args);
        return originalPush.apply(this, args);
      };
      
      console.log('AdSense monitoring activated');
    }
  }