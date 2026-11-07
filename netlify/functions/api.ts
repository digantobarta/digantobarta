export interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string>;
  body?: string;
}

export const handler = async (event: NetlifyEvent, _context: any) => {
  const path = (event.path || '').replace(/\/\.netlify\/functions\/api/, '');

  const jsonResponse = (statusCode: number, body: any) => ({
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify(body),
  });

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  return jsonResponse(200, {
    message: 'Diganta Barta Netlify Serverless API Online',
    timestamp: new Date().toISOString(),
    path,
  });
};
