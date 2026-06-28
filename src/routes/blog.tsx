import { createFileRoute } from "@tanstack/react-router";
import BlogPage from "@/components/BlogPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Koushik Nagardona" },
      {
        name: "description",
        content:
          "Thoughts on data engineering, machine learning, and building things that actually work — by Koushik Nagardona.",
      },
      { property: "og:title", content: "Blog — Koushik Nagardona" },
      { property: "og:description", content: "Data, ML, and engineering notes from Koushik." },
    ],
  }),
  component: BlogPage,
});
