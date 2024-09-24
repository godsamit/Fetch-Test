import { parse } from 'cookie';

export function getAuthToken(request) {
  const cookieHeader = request.headers.get('Cookie');
  console.log(cookieHeader)
  if (!cookieHeader) {
    return null;
  }
  const cookies = parse(cookieHeader);
  return cookies['fetch-access-token'] || null;
}