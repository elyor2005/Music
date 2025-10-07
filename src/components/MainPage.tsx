"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import SongsContainer from "@/components/SongsContainer";

export default function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState(() => ({
    seed: searchParams.get("seed") || "123",
    lang: searchParams.get("lang") || "en",
    count: parseInt(searchParams.get("count") || "50", 10),
    likes: parseFloat(searchParams.get("likes") || "5"),
    view: (searchParams.get("view") as "table" | "gallery") || "table",
  }));

  return (
    <div className="p-6 space-y-6">
      <Toolbar
        params={params}
        onChange={(newParams) => {
          setParams((prev) => ({ ...prev, ...newParams }));
          const query = new URLSearchParams({
            seed: newParams.seed,
            lang: newParams.lang,
            count: newParams.count.toString(),
            likes: newParams.likes.toString(),
            view: newParams.view,
          });
          router.replace("?" + query.toString());
        }}
      />

      <SongsContainer seed={params.seed} lang={params.lang} count={params.count} likes={params.likes} view={params.view} />
    </div>
  );
}
