import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date for display (client-safe version)
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

/**
 * Convert Google Drive sharing link to a direct image link
 * @param url - The Google Drive sharing URL
 * @returns The direct image URL that can be used in img tags
 */
export function convertGoogleDriveLink(url: string): string {
  if (!url) return url;
  
  // Check if it's a Google Drive link
  if (url.includes('drive.google.com')) {
    // Handle different Google Drive URL formats
    let fileId = '';
    
    if (url.includes('/file/d/')) {
      // Format: https://drive.google.com/file/d/[fileId]/view
      fileId = url.split('/file/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      // Format: https://drive.google.com/open?id=[fileId]
      fileId = url.split('id=')[1].split('&')[0];
    }
    
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  return url;
}
