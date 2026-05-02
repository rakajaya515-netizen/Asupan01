export async function generateMetadata({ params }) {
  return {
    title: `Watch ${params.id} - Asupanmu`,
  };
}

export default function Watch({ params }) {
  const { id, source } = params;

  let embed = "";

  if (source === "dood") {
    embed = `https://doodstream.com/e/${id}`;
  }

  if (source === "vidara") {
    embed = `https://vidara.so/${id}`;
  }

  if (!id || !source) {
  return <div>Video tidak ditemukan</div>;
  }
  
  return (
    <main style={{ padding: 20 }}>
      <h1>Watch Video</h1>

      <iframe
        src={embed}
        width="100%"
        height="500"
        allowFullScreen
      ></iframe>
    </main>
  );
}
