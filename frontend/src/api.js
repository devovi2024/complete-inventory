const API = import.meta.env.VITE_API_URL || '';

async function parseBody(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.trim() || undefined };
  }
}

export async function request(path, options = {}, retry = true, attempt = 0) {
  const token = localStorage.getItem('factory_token');
  let response;
  
  try {
    response = await fetch(`${API}/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch (error) {
    if (attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 250 * (2 ** attempt)));
      return request(path, options, retry, attempt + 1);
    }
    throw new Error('নেটওয়ার্ক সংযোগ পাওয়া যাচ্ছে না');
  }

  const body = await parseBody(response);

  if (response.status === 401 && retry && localStorage.getItem('factory_refresh_token') && !path.startsWith('/auth/')) {
    const refreshed = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: localStorage.getItem('factory_refresh_token') })
    }, false);
    localStorage.setItem('factory_token', refreshed.token);
    localStorage.setItem('factory_refresh_token', refreshed.refreshToken);
    return request(path, options, false);
  }

  if (response.status >= 500 && response.status < 600 && attempt < 3 && !body.message) {
    await new Promise(resolve => setTimeout(resolve, 250 * (2 ** attempt)));
    return request(path, options, retry, attempt + 1);
  }

  if (!response.ok) throw new Error(body.message || 'অনুরোধটি সম্পন্ন হয়নি');
  return body;
}

export const get = path => request(path);
export const post = (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) });
export const put = (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) });
export const del = path => request(path, { method: 'DELETE' });