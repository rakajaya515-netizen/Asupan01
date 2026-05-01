export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const id = searchParams.get("id");

  if (!id) return Response.json({ url: "" });

  if (source === "vidara") {
    return Response.json({
      url: `https://vidara.so/embed-${id}.html`
    });
  }

  if (source === "dood") {
    return Response.json({
      url: `https://dood.so/e/${id}`
    });
  }

  return Response.json({ url: "" });
}
