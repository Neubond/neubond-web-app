import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // SharePoint validation handshake
  const validationToken = request.nextUrl.searchParams.get('validationToken');
  if (validationToken) {
    return new Response(validationToken, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    // Step 1 — Get Azure access token
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

    // Step 2 — Fetch Word file from SharePoint and convert to PDF
    const filePath = "0. QMS/1. DHF Loop I/3. Phase III - Design Outputs/IFU & Labels (manufacturer information)/NBD-LP1-IFU-001 Rev 01 Neubond IFU.docx";
    
    const fileRes = await fetch(
      `https://graph.microsoft.com/v1.0/sites/neubond.sharepoint.com,${process.env.SHAREPOINT_SITE_ID}/drive/root:/${encodeURIComponent(filePath)}:/content?format=pdf`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    if (!fileRes.ok) {
      const error = await fileRes.text();
      console.error('SharePoint fetch error:', error);
      return new Response('Failed to fetch file', { status: 500 });
    }

    const pdfBuffer = await fileRes.arrayBuffer();

    // Step 3 — Store in Vercel Blob
    await put('document.pdf', pdfBuffer, {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/pdf',
    });

    console.log('PDF updated successfully');
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}