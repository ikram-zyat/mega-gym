import { useEffect, useState } from "react";
import { useStore } from "./store.js";
import { hash } from "./auth.js";
import { SEED, TONES, MESSAGES, OBJECTIFS, memberFields, leadFields, coachFields } from "./data.js";
import Manager from "./Manager.jsx";

// Accès administrateur de démonstration.
const ADMIN = { id: "admin", pw: "gym2025" };

const Dumbbell = ({ h = 28, color = "#ff3b5c" }) => (
  <svg width={h * 1.5} height={h} viewBox="0 0 60 40" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" aria-hidden="true">
    <path d="M4 14v12M12 8v24M56 14v12M48 8v24M12 20h36" />
  </svg>
);
const Icon = ({ children }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>
);
const user = <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></>;
const users = <><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.8" /><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6zM15 14.5c3.6 0 7 1.6 7 5.5h-4.5" /></>;
const fr = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function App() {
  const [route, setRoute] = useState(location.hash || "#/");
  const [session, setSession] = useState(() => { try { return JSON.parse(sessionStorage.getItem("mg-session")); } catch { return null; } });
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useStore("mg-accounts", []);
  const [members, setMembers] = useStore("mg-members", SEED.members);
  const [leads, setLeads] = useStore("mg-leads", SEED.leads);
  const [coachs, setCoachs] = useStore("mg-coachs", SEED.coachs);
  const role = session?.role;

  useEffect(() => {
    const onHash = () => { setRoute(location.hash || "#/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const start = (s) => {
    try { sessionStorage.setItem("mg-session", JSON.stringify(s)); } catch {}
    setSession(s); setError("");
    location.hash = s.role === "admin" ? "#/inscriptions" : "#/mon-espace";
  };
  const logout = () => {
    try { sessionStorage.removeItem("mg-session"); } catch {}
    setSession(null); setMode("login"); location.hash = "#/";
  };

  const login = async (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const id = d.get("id").trim().toLowerCase(), pw = d.get("pw");
    if (id === ADMIN.id && pw === ADMIN.pw) return start({ role: "admin", nom: "admin" });
    const acc = accounts.find((a) => a.email === id);
    if (acc && acc.hash === (await hash(acc.email, pw))) return start({ role: "client", nom: acc.nom, email: acc.email });
    setError("Identifiant ou mot de passe incorrect.");
  };

  const signup = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const email = d.email.trim().toLowerCase(), nom = d.nom.trim();
    if (d.pw.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");
    if (accounts.some((a) => a.email === email)) return setError("Un compte existe déjà avec cet e-mail. Connectez-vous.");
    setAccounts([...accounts, { email, nom, hash: await hash(email, d.pw) }]);
    setLeads([{ id: Date.now(), nom, email, telephone: d.tel, objectif: d.objectif, statut: "Nouveau", note: "Inscription en ligne" }, ...leads]);
    start({ role: "client", nom, email });
  };

  const reset = () => {
    if (!window.confirm("Remettre les données de démonstration ? Les comptes clients seront supprimés.")) return;
    setMembers(SEED.members); setLeads(SEED.leads); setCoachs(SEED.coachs); setAccounts([]);
  };
  const convert = (l) => {
    setMembers([{ id: Date.now(), nom: l.nom, email: l.email || "", telephone: l.telephone, formule: "Mensuel", coach: "—", debut: new Date().toISOString().slice(0, 10), statut: "En attente" }, ...members]);
    setLeads(leads.map((x) => (x.id === l.id ? { ...x, statut: "Accepté", inscrit: true } : x)));
  };

  const locked = (
    <section className="wrap"><div className="card">
      <h3>{role === "client" ? "Réservé à l'administration" : "Connexion requise"}</h3>
      <p>{role === "client" ? "Cette section est réservée à l'équipe de la salle." : "Connectez-vous depuis l'accueil pour continuer."}</p>
      <a className="btn" href={role === "client" ? "#/mon-espace" : "#/"}>{role === "client" ? "Aller à mon espace" : "Aller à la connexion"}</a>
    </div></section>
  );

  const myLead = leads.find((l) => l.email && l.email === session?.email);
  const myMember = members.find((m) => m.email && m.email === session?.email);
  const badge = (v) => <span className={`badge badge--${TONES[v] || "info"}`}>{v}</span>;

  const space = (
    <div className="space">
      <h2>Bonjour, {session?.nom}</h2>
      {myLead && !myLead.inscrit && (
        <div className="card"><h3>Ma candidature</h3>{badge(myLead.statut)}
          <p style={{ marginTop: 10 }}>{MESSAGES[myLead.statut]}</p>
          <div className="kv"><div><span>Objectif</span>{myLead.objectif}</div><div><span>Téléphone</span>{myLead.telephone || "—"}</div></div></div>
      )}
      {myMember && (
        <div className="card"><h3>Mon abonnement</h3>{badge(myMember.statut)}
          <div className="kv"><div><span>Formule</span>{myMember.formule}</div><div><span>Coach</span>{myMember.coach}</div><div><span>Début</span>{fr(myMember.debut)}</div></div></div>
      )}
      {!myLead && !myMember && <div className="card"><h3>Aucune demande</h3><p>Aucune candidature n'est liée à ce compte. Contactez l'accueil de la salle.</p></div>}
      <div className="card"><h3>Nos coachs</h3>
        <div className="coachlist">{coachs.map((c) => <div key={c.id}><b>{c.nom}</b><p>{c.specialite}</p><p>{c.dispo}</p></div>)}</div></div>
    </div>
  );

  let page;
  if (route === "#/mon-espace") page = role === "client" ? space : locked;
  else if (route === "#/inscriptions") page = role === "admin" ? <Manager title="Inscriptions" noun="une inscription" fields={memberFields(coachs)} items={members} setItems={setMembers} /> : locked;
  else if (route === "#/candidats") page = role === "admin" ? (
    <Manager title="Candidats" noun="un candidat" fields={leadFields} items={leads} setItems={setLeads}
      rowAction={(l) => l.inscrit ? <span className="mute">Inscrit</span> : l.statut !== "Refusé" && <button className="btn btn--sm" onClick={() => convert(l)}>Inscrire</button>} />
  ) : locked;
  else if (route === "#/coachs") page = role === "admin" ? <Manager title="Coachs" noun="un coach" fields={coachFields} items={coachs} setItems={setCoachs} /> : locked;
  else page = (
    <>
      <header className="hero">
        <div className="hero__motto" aria-hidden="true">PLUS<br />FORT<br />CHAQUE<br />JOUR</div>
        <div className="hero__art"><Dumbbell h={220} color="#262e40" /></div>
        <div className="hero__in">
          <h1>Méga <b>Gym</b></h1>
          <h2>Gestion des inscriptions, des candidats et des coachs</h2>
          <p>Une application web simple et efficace pour gérer facilement votre salle de sport.</p>
          {session ? <a className="btn" href={role === "admin" ? "#/inscriptions" : "#/mon-espace"}>Commencer →</a>
            : <button className="btn" onClick={() => { setMode("signup"); document.getElementById("acces")?.scrollIntoView({ behavior: "smooth" }); }}>Commencer →</button>}
        </div>
      </header>
      <section className="wrap home">
        {role === "client" ? (
          <a className="card" href="#/mon-espace"><span className="ico ico--red"><Icon>{user}</Icon></span>
            <h3>Mon espace</h3><p>Suivez votre candidature, votre abonnement et découvrez nos coachs.</p><span className="go">Ouvrir →</span></a>
        ) : (<>
          <a className="card" href="#/inscriptions"><span className="ico ico--red"><Icon>{user}</Icon></span>
            <h3>Inscriptions</h3><p>Gérez les nouvelles inscriptions des membres à la salle.</p><span className="go">{members.filter((m) => m.statut === "Actif").length} membres actifs →</span></a>
          <a className="card" href="#/candidats"><span className="ico ico--blue"><Icon>{users}</Icon></span>
            <h3>Candidats</h3><p>Suivez les candidatures et gérez les informations des futurs membres.</p><span className="go">{leads.filter((l) => !l.inscrit && l.statut !== "Refusé").length} en cours →</span></a>
          <a className="card" href="#/coachs"><span className="ico ico--green"><Icon>{user}</Icon></span>
            <h3>Coachs</h3><p>Gérez les coachs et leurs disponibilités.</p><span className="go">{coachs.length} coachs →</span></a>
        </>)}
        <div className="card login" id="acces">
          <Dumbbell h={26} />
          {session ? (
            <><h3 style={{ marginTop: 10 }}>Bonjour, {session.nom}</h3>
              <p>{role === "admin" ? "Vous êtes connecté en administrateur." : "Vous êtes connecté. Retrouvez votre suivi dans votre espace."}</p>
              <button className="btn" onClick={logout}>Se déconnecter</button></>
          ) : (
            <>
              <div className="tabs" role="group" aria-label="Choisir une action">
                <button aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); }}>Se connecter</button>
                <button aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); }}>Créer un compte</button>
              </div>
              {mode === "login" ? (
                <form onSubmit={login}>
                  <input name="id" placeholder="Identifiant ou e-mail" aria-label="Identifiant ou e-mail" autoComplete="username" required />
                  <input name="pw" type="password" placeholder="Mot de passe" aria-label="Mot de passe" autoComplete="current-password" required />
                  {error && <p className="err" role="alert">{error}</p>}
                  <button className="btn btn--full" type="submit">Se connecter</button>
                  <p className="hint">Démo administrateur : {ADMIN.id} / {ADMIN.pw}</p>
                </form>
              ) : (
                <form onSubmit={signup}>
                  <input name="nom" placeholder="Nom complet" aria-label="Nom complet" autoComplete="name" required />
                  <input name="email" type="email" placeholder="E-mail" aria-label="E-mail" autoComplete="email" required />
                  <input name="tel" type="tel" placeholder="Téléphone" aria-label="Téléphone" autoComplete="tel" required />
                  <select name="objectif" aria-label="Votre objectif">{OBJECTIFS.map((o) => <option key={o}>{o}</option>)}</select>
                  <input name="pw" type="password" placeholder="Mot de passe (6 caractères minimum)" aria-label="Mot de passe" autoComplete="new-password" required />
                  {error && <p className="err" role="alert">{error}</p>}
                  <button className="btn btn--full" type="submit">Créer mon compte</button>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );

  return (
    <>
      <nav className="top"><div className="top__in">
        <a className="logo" href="#/"><Dumbbell />Méga <b>Gym</b></a>
        <div className="nav">
          <a href="#/" className={route === "#/" ? "on" : ""}>Accueil</a>
          {role === "client" ? <a href="#/mon-espace" className={route === "#/mon-espace" ? "on" : ""}>Mon espace</a>
            : [["#/inscriptions", "Inscriptions"], ["#/candidats", "Candidats"], ["#/coachs", "Coachs"]].map(([h, t]) => <a key={h} href={h} className={route === h ? "on" : ""}>{t}</a>)}
        </div>
        {session ? <button className="btn btn--line" onClick={logout}>Se déconnecter</button>
          : <a className="btn btn--line" href="#/" onClick={() => setMode("login")}>Se connecter</a>}
      </div></nav>
      <main>{page}</main>
      <footer className="foot">Méga Gym © {new Date().getFullYear()}. Projet de démonstration : les données restent dans votre navigateur.
        <button className="linkbtn" onClick={reset}>Réinitialiser la démo</button></footer>
    </>
  );
}
