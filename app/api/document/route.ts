import { list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list({ 
      prefix: 'document',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    if (!blobs.length) {
      return new Response('Document not found', { status: 404 });
    }

    console.log('Blob object:', JSON.stringify(blobs[0]));

    // Fetch PDF using download URL
    const pdfRes = await fetch(blobs[0].downloadUrl);
    const pdfBuffer = await pdfRes.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Neubond-IFU.pdf"',
      }
    });
    
  } catch (error) {
    console.error('Document serve error:', error);
    return new Response(`Internal server error: ${error}`, { status: 500 });
  }
}