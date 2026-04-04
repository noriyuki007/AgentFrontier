const WP_API_URL = 'https://agent-frontier.jp/wp-json/wp/v2';

// In-memory cache for build-time optimization
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

// Fallback / Mock Data to prevent build failures when API is down
const MOCK_POST = {
  id: 0,
  date: new Date().toISOString(),
  title: { rendered: "コンテンツ提供まで少々お待ちください" },
  content: { rendered: "<p>現在、システムのメンテナンスを行っております。最新の記事はまもなく公開されます。</p>" },
  excerpt: { rendered: "メンテナンス中" },
  _embedded: {}
};

async function safeJson(res: Response, fallback: any) {
  try {
    const text = await res.text();
    // Strip any PHP warnings/HTML prepended to JSON
    const jsonStart = text.search(/[\[\{]/);
    if (jsonStart === -1) {
       console.error("No JSON start found in response. Text sample:", text.slice(0, 100));
       return fallback;
    }
    const cleanJson = text.substring(jsonStart);
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error in safeJson:", e);
    return fallback;
  }
}

async function fetchWithCache(url: string, revalidate = 60) {
  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
       console.error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
       return null;
    }
    const data = await safeJson(res, null);
    if (data) {
      cache.set(url, { data, expiry: now + CACHE_TTL });
    }
    return data;
  } catch (e: any) {
    console.warn(`API Fetch Failure for ${url}:`, e?.message || "Unknown error");
    return null;
  }
}

export async function fetchPosts(perPage = 10, categoryId?: number) {
  let url = `${WP_API_URL}/posts?_embed&per_page=${perPage}`;
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }
  url += `&_cb=${Date.now()}`;
  
  const data = await fetchWithCache(url, 60);
  return data || [];
}

export async function fetchPost(id: string) {
  const url = `${WP_API_URL}/posts/${id}?_embed`;
  const data = await fetchWithCache(url, 60);
  
  if (!data) {
    return { ...MOCK_POST, id: Number(id) };
  }
  return data;
}

export async function fetchCategories() {
  const url = `${WP_API_URL}/categories`;
  const data = await fetchWithCache(url, 3600);
  return data || [];
}

export function getFeaturedImage(post: any): string {
  if (post?._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    return media.source_url;
  }
  return '/placeholder.jpg'; // Generic fallback
}

export async function fetchPostBySlug(slug: string) {
  const url = `${WP_API_URL}/posts?_embed&slug=${slug}`;
  const data = await fetchWithCache(url, 60);
  if (!data || data.length === 0) return null;
  return data[0];
}
