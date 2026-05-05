import { useRouter } from "next/router";

export default function Watch() {
  const router = useRouter();
  const { code } = router.query;

  if (!code) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <iframe
      src={`https://vidara.so/${code}`}
      style={{
        width: "100%",
        height: "100vh",
        border: "none"
      }}
    />
  );
}
