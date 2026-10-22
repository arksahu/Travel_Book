/**
 * Itinerary Print and PDF Export Helper
 */

export const triggerPrintItinerary = (tripTitle = 'WanderWise-Itinerary') => {
  const originalTitle = document.title;
  document.title = `${tripTitle.replace(/\s+/g, '_')}_Itinerary`;
  
  // Trigger standard browser print which supports "Save as PDF"
  window.print();
  
  // Restore document title after print dialogue
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
};
