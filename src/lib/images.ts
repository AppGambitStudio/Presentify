/**
 * Image Search via Unsplash API
 * Free tier: 50 requests/hour (demo), unlimited with approval
 * Sign up: https://unsplash.com/developers
 *
 * Returns photo URLs with proper attribution.
 * Optional -- if UNSPLASH_ACCESS_KEY is not set, returns null gracefully.
 */

export interface ImageResult {
  url: string;              // regular size (~1080px wide)
  thumbUrl: string;         // thumbnail (~200px)
  alt: string;              // description
  credit: string;           // "Photo by X on Unsplash"
  creditUrl: string;        // photographer's Unsplash profile
}

export async function searchImages(query: string, count: number = 3): Promise<ImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log("[Images] UNSPLASH_ACCESS_KEY not set, skipping image search");
    return [];
  }

  try {
    console.log(`[Images] Unsplash: "${query}"`);

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Images] Unsplash error (${res.status}): ${err}`);
      return [];
    }

    const data = await res.json();

    return (data.results || []).map((photo: any) => ({
      url: photo.urls?.regular || photo.urls?.small || "",
      thumbUrl: photo.urls?.thumb || photo.urls?.small || "",
      alt: photo.alt_description || photo.description || query,
      credit: `Photo by ${photo.user?.name || "Unknown"} on Unsplash`,
      creditUrl: photo.user?.links?.html || "https://unsplash.com",
    }));
  } catch (err: any) {
    console.error(`[Images] Unsplash failed: ${err.message}`);
    return [];
  }
}

/**
 * Find a single relevant image for a slide topic.
 * Returns formatted data that can be used in slide sections.
 */
export async function findSlideImage(topic: string): Promise<ImageResult | null> {
  const results = await searchImages(topic, 1);
  return results.length > 0 ? results[0] : null;
}
