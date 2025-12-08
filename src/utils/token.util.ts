interface RequestWithHeaders {
  headers?: Record<string, unknown>;
}

export function extractTokenFromRequest(
  request: RequestWithHeaders,
): string | undefined {
  const authHeader = request?.headers?.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return undefined;
  }

  const parts = authHeader.split(' ');

  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : undefined;
}
