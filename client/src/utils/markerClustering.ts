export function findClusterBucket(zoom: number): "wide" | "medium" | "fine" {
  if (zoom <= 6) return "wide";
  if (zoom <= 10) return "medium";
  return "fine";
}
