export async function GET() {
  try {
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

    // Browse inside 0. QMS using its item ID
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/drives/${process.env.SHAREPOINT_DRIVE_ID}/items/01G6J3RA6KECF5D63FOBD3FO3QN3CSQW2N/children`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );
    const data = await res.json();

    // Just return names
    const items = data.value?.map((item: any) => ({
      name: item.name,
      id: item.id,
      type: item.folder ? 'folder' : 'file',
    }));

    return new Response(JSON.stringify(items, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
}