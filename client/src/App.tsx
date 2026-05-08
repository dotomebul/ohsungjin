import { Link, Route, Switch } from "wouter";
import { useMemo, useState } from "react";
import { Home } from "./pages/Home";
import { MapPage } from "./pages/Map";
import { DisasterGuide } from "./pages/DisasterGuide";
import { EmergencyContacts } from "./pages/EmergencyContacts";
import { Settings } from "./pages/Settings";
import { NewsPage } from "./pages/NewsPage";

type Region = "us" | "eu" | "kr" | "jp";

type Lang = "ko" | "en" | "ja";

export function App() {
  const [region, setRegion] = useState<Region | null>(null);
  const [lang, setLang] = useState<Lang | null>(null);

  const isReady = useMemo(() => !!region && !!lang, [region, lang]);

  if (!isReady) {
    return (
      <main className="container">
        <section className="card">
          <h1>Evacora 초기 설정</h1>
          <p>처음 접속 시 지역과 언어를 선택해주세요.</p>

          <h3>지역 선택</h3>
          <div className="chips">
            {(["us", "eu", "kr", "jp"] as Region[]).map((r) => (
              <button key={r} className={region === r ? "chip active" : "chip"} onClick={() => setRegion(r)}>{r.toUpperCase()}</button>
            ))}
          </div>

          <h3>언어 선택</h3>
          <div className="chips">
            {(["ko", "en", "ja"] as Lang[]).map((l) => (
              <button key={l} className={lang === l ? "chip active" : "chip"} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Evacora</h1>
        <small>{region?.toUpperCase()} · {lang?.toUpperCase()}</small>
      </header>
      <nav className="tabs">
        <Link href="/">홈</Link>
        <Link href="/map">지도</Link>
        <Link href="/action-guide">행동가이드</Link>
        <Link href="/contacts">연락처</Link>
        <Link href="/settings">설정</Link>
        <Link href="/news">뉴스</Link>
      </nav>
      <main className="container">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/map" component={MapPage} />
          <Route path="/action-guide" component={DisasterGuide} />
          <Route path="/contacts" component={EmergencyContacts} />
          <Route path="/settings" component={Settings} />
          <Route path="/news" component={NewsPage} />
        </Switch>
      </main>
    </div>
  );
}
