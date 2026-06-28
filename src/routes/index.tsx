import { createFileRoute } from "@tanstack/react-router";
import Portfolio from "@/components/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koushik Nagardona — Data Scientist & AI Engineer in Dubai" },
      { name: "description", content: "Portfolio of Koushik Nagardona — Data Scientist and AI Engineer based in Dubai, turning raw data into real decisions." },
      { property: "og:title", content: "Koushik Nagardona — Built different. Powered by data." },
      { property: "og:description", content: "Data Scientist and AI Engineer based in Dubai." },
    ],
  }),
  component: Portfolio,
});
