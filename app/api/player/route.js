export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const source = searchParams.get("source");
  const id = searchParams.get("id");

  if (!source || !id) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  let url = "";

  if (source === "dood") {
    url = `https://doodstream.com/e/${id}`;
  }

  if (source === "vidara") {
    url = `https://vidara.so/embed/${id}`;
  }

  if (!url) {
    return Response.json({ error: "Invalid source" }, { status: 400 });
  }

  return Response.json({ url });
}
