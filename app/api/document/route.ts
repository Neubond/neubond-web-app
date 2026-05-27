import { list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'document' });
    
    if (!blobs.length) {
      return new Response('Document not found', { status: 404 });
    }

    return Response.redirect(blobs[0].url);
    
  } catch (error) {
    console.error('Document serve error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}