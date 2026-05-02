export default function Watch({ params }) {
  const { source, id } = params;

  let embed = "";

  if (source === "dood") {
    embed = `https://doodstream.com/e/${id}`;
  }

  if (source === "vidara") {
    embed = `https://vidara.so/${id}`;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Watch Video</h1>

      <iframe
        src={embed}
        width="100%"
        height="500"
        allowFullScreen
      />
    </div>
  );
}
