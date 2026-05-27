import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Validation handshake
  const validationToken = request.nextUrl.searchParams.get('validationToken');
  if (validationToken) {
    return new Response(validationToken, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    const body = await request.json();

    // Get access token
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.AZURE_CLIENT_ID!,
          client_secret: process.env.AZURE_CLIENT_SECRET!,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    );
    const { access_token } = await tokenRes.json();

    // Get the changed items
    const changedItems = body.value || [];
    
    for (const notification of changedItems) {
      // Get the actual changes
      const changesRes = await fetch(
        `https://graph.microsoft.com/v1.0/drives/${process.env.SHAREPOINT_DRIVE_ID}/items/${process.env.SHAREPOINT_FILE_ID}`,
        {
          headers: { Authorization: `Bearer ${access_token}` }
        }
      );
      const fileData = await changesRes.json();

      // Check if our specific file was modified
      // Compare last modified time with what we last processed
      const lastModified = new Date(fileData.lastModifiedDateTime).getTime();
      const lastProcessed = parseInt(process.env.LAST_PROCESSED || '0');

      if (lastModified <= lastProcessed) {
        console.log('File not changed, skipping');
        return new Response('OK', { status: 200 });
      }
    }

    // Our file changed — convert and upload
    const fileRes = await fetch(
      `https://graph.microsoft.com/v1.0/drives/${process.env.SHAREPOINT_DRIVE_ID}/items/${process.env.SHAREPOINT_FILE_ID}/content?format=pdf`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const pdfBuffer = await fileRes.arrayBuffer();

    await put('document.pdf', pdfBuffer, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/pdf',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('PDF updated successfully');
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}