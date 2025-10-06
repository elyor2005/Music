"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Toolbar from "@/components/Toolbar";
import SongsTable from "@/components/SongsTable";
import SongsGallery from "@/components/SongsGallery";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState(() => ({
    seed: searchParams.get("seed") || "123",
    lang: searchParams.get("lang") || "en",
    count: parseInt(searchParams.get("count") || "50", 10),
    likes: parseFloat(searchParams.get("likes") || "5"),
    view: (searchParams.get("view") as "table" | "gallery") || "table",
    page: parseInt(searchParams.get("page") || "0", 10),
  }));

  // Sync params -> URL
  useEffect(() => {
    const query = new URLSearchParams({
      seed: params.seed,
      lang: params.lang,
      count: params.count.toString(),
      likes: params.likes.toString(),
      view: params.view,
      page: params.page.toString(),
    });
    router.replace("?" + query.toString());
  }, [params, router]);

  // Fetch data
  const { data, isLoading } = useSWR(`/api/songs?seed=${params.seed}&lang=${params.lang}&count=${params.count}&likes=${params.likes}&page=${params.page}&pageSize=10`, fetcher);

  return (
    <div className="p-6 space-y-6">
      <Toolbar params={params} onChange={setParams} />

      {params.view === "table" ? <SongsTable songs={data?.songs || []} page={params.page} totalPages={data?.totalPages || 1} onPageChange={(newPage) => setParams((prev) => ({ ...prev, page: newPage }))} /> : <SongsGallery seed={params.seed} lang={params.lang} count={params.count} likes={params.likes} />}

      {isLoading && <p className="text-gray-500">Loading...</p>}
    </div>
  );
}
