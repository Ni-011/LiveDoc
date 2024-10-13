"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const router = useRouter();
  const loadNewDoc = () => {
    router.push(`/Editor/${uuidV4()}`);
  };
  return (
    <div>
      <Button onClick={loadNewDoc}>New Doc</Button>
    </div>
  );
}
