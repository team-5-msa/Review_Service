export function extractTokenFromRequest(request: any): string | undefined {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return undefined;
  }
  const parts = authHeader.split(' ');
  return parts.length === 2 ? parts[1] : undefined;
}
