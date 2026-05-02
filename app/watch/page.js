import { redirect } from "next/navigation";

export default function OldWatch({ searchParams }) {
  const id = searchParams.id;
  const source = searchParams.source;

  if (id && source) {
    redirect(`/watch/${source}/${id}`);
  }

  return <div>Invalid URL</div>;
}
