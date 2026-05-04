import { useRouter } from "next/router"

export default function Watch() {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");

    if (url) {
      window.location.href = url;
    }
  }

  return <p style={{ color: "white" }}>Redirecting...</p>;
}
