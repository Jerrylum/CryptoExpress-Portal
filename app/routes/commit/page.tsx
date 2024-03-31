import { RouteCommitProgressPage } from "@/components/RouteCommitProgressPage";
import { Suspense } from "react";

export default function RouteAppPage() {
  return (
    <Suspense>
      <RouteCommitProgressPage />
    </Suspense>
  );
}
