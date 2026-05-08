import { getDisasterGuides } from "@shared/disasterData";

export function DisasterGuide() {
  const guides = getDisasterGuides("global").slice(0, 3);
  return (
    <section className="card">
      <h2>행동 가이드</h2>
      <ul>{guides.map((g) => <li key={g.code}><b>{g.name}</b> - {g.immediateActions[0]}</li>)}</ul>
    </section>
  );
}
