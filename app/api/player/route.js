export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const id = searchParams.get("id");

  let url = "";

  if (source === "dood") {
    url = `https://doodstream.com/e/${id}`;
  }

  if (source === "vidara") {
    url = `https://vidara.so/embed/${id}`;
  }

  return Response.json({ url });
}
