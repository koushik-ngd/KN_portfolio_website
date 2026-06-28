import { createFileRoute } from "@tanstack/react-router";
import ProjectsPage from "@/components/ProjectsPage";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Koushik Nagardona" },
      {
        name: "description",
        content:
          "End-to-end data projects across real-estate analytics, predictive modelling, and explainable AI — by Koushik Nagardona.",
      },
      { property: "og:title", content: "Projects — Koushik Nagardona" },
      { property: "og:description", content: "Featured data and ML engineering projects." },
    ],
  }),
  component: ProjectsPage,
});
