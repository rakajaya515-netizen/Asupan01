export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const id = searchParams.get("id");

  let url = "";

  if (!id || !source) {
    return Response.json({ url: "" });
  }

  if (source === "dood") {
    // domain cepat & stabil
    url = `https://dood.cx/e/${id}`;
  }

  if (source === "vidara") {
    url = `https://vidara.so/embed/${id}`;
  }

  return Response.json({ url });
}
