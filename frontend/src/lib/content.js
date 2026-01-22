// Helper function to fetch data securely
async function fetchData(url) {
  if (!url) {
    console.error("Error: Missing environment variable for URL");
    return []; // Return empty array to prevent app crash
  }

  // Add a query parameter to force the cloudfront distribution to
  // return the latest data
  const queryURL = `${url}?t=${new Date().getTime()}`;

  try {
    // We add 'no-store' to ensure we always get fresh data, 
    // as it will be getting updated every time we add something 
    // new or change a page in the CMS editor.
    const res = await fetch(queryURL, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return []; 
  }
}

export async function getAllProducts() {
  return await fetchData(process.env.URL_PRODUCTS);
}

export async function getAllServices() {
  return await fetchData(process.env.URL_SERVICES);
}

export async function getAllProjects() {
  return await fetchData(process.env.URL_PROJECTS);
}

export function findBySlug(items, slug) {
  if (!items || !Array.isArray(items)) return null;
  return items.find((x) => x.slug === slug) || null;
}