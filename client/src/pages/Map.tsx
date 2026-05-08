import { findClusterBucket } from "../utils/markerClustering";

export function MapPage() {
  const bucket = findClusterBucket(9);
  return <section className="card"><h2>지도/대피소</h2><p>현재 지도 군집 단계: {bucket}</p></section>;
}
