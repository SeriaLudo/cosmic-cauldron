import { createFileRoute } from "@tanstack/react-router";
import { PeriodicTablePage } from "../components/pages";

export const Route = createFileRoute("/")({
  component: PeriodicTablePage,
});
