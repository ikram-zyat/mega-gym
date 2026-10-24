import { useEffect, useState } from "react";
import { useStore } from "./store.js";
import { hash, hashAdmin } from "./auth.js";
import { ADMIN } from "./admin.config.js";
import { SEED, TONES, MESSAGES, OBJECTIFS, memberFields, leadFields, coachFields } from "./data.js";
import Manager from "./Manager.jsx";

// Photo du hero : placez une image dans public/images/hero.jpg (voir le README).
const HERO = import.meta.env.BASE_URL + "images/hero.jpg";

const Dumbbell = ({ h = 28, color = "#f9395a" }) => (
  <svg width={h * 1.5} height={h} viewBox="0 0 60 40" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" aria-hidden="true">
    <path d="M4 14v12M12 8v24M56 14v12M48 8v24M12 20h36" />
  </svg>
);
const Arrow = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Line = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const userLine = <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>;
const lockLine = <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>;
const Solid = ({ children }) => <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>;
const person = <><circle cx="12" cy="8" r="4.2" /><path d="M4 21c0-4.6 3.6-7 8-7s8 2.4 8 7z" /></>;
const group = <><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.8" /><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6zM15 14.5c3.6 0 7 1.6 7 5.5h-4.5" /></>;
const fr = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function App() {
  const [route, setRoute] = useState(location.hash || "#/");
  const [session, setSession] = useState(() => { try { return JSON.parse(sessionStorage.getItem("mg2-session")); } catch { return null; } });
  const [mode, setMode] = useState("login"); // login | client
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useStore("mg2-accounts", []);
  const [members, setMembers] = useStore("mg2-members", SEED.members);
  const [leads, setLeads] = useStore("mg2-leads", SEED.leads);
  const [coachs, setCoachs] = useStore("mg2-coachs", SEED.coachs);
  const role = session?.role;

  useEffect(() => {
    const onHash = () => { setRoute(location.hash || "#/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const start = (s) => {
    try { sessionStorage.setItem("mg2-session", JSON.stringify(s)); } catch {}
    setSession(s); setError("");
    location.hash = s.role === "admin" ? "#/inscriptions" : "#/mon-espace";
  };
  const logout = () => {
    try { sessionStorage.removeItem("mg2-session"); } catch {}
    setSession(null); setMode("login"); location.hash = "#/";
  };
  const goLogin = () => { setMode("login"); setTimeout(() => document.getElementById("acces")?.scrollIntoView({ behavior: "smooth" }), 0); };
  const switchMode = (m) => { setMode(m); setError(""); };

  const login = async (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const id = d.get("id").trim().toLowerCase(), pw = d.get("pw");
    if (ADMIN && ADMIN.email === id && ADMIN.hash === (await hashAdmin(id, pw, ADMIN.salt))) return start({ role: "admin", nom: ADMIN.nom });
    const h = await hash(id, pw);
    const acc = accounts.find((a) => a.email === id && a.hash === h);
    if (acc) return start({ role: "client", nom: acc.nom, email: acc.email });
    setError("Identifiant ou mot de passe incorrect.");
  };

  const signup = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const email = d.email.trim().toLowerCase(), nom = d.nom.trim();
    if (d.pw.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");
    if (accounts.some((a) => a.email === email) || ADMIN?.email === email) return setError("Un compte existe déjà avec cet e-mail. Connectez-vous.");
    setAccounts([...accounts, { email, nom, hash: await hash(email, d.pw) }]);
    setLeads([{ id: Date.now(), nom, email, telephone: d.tel, objectif: d.objectif, statut: "Nouveau", note: "Inscription en ligne" }, ...leads]);
    start({ role: "client", nom, email });
  };

  const convert = (l) => {
    setMembers([{ id: Date.now(), nom: l.nom, email: l.email || "", telephone: l.telephone, formule: "Mensuel", coach: "—", debut: new Date().toISOString().slice(0, 10), statut: "En attente" }, ...members]);
    setLeads(leads.map((x) => (x.id === l.id ? { ...x, statut: "Accepté", inscrit: true } : x)));
  };

  const locked = (
    <section className="wrap"><div className="card">
      <h3>{role === "client" ? "Réservé à l'administration" : "Connexion requise"}</h3>
      <p>{role === "client" ? "Cette section est réservée à l'équipe de la salle." : "Connectez-vous depuis l'accueil pour continuer."}</p>
      {role === "client" ? <a className="btn" href="#/mon-espace">Aller à mon espace</a> : <a className="btn" href="#/" onClick={goLogin}>Aller à la connexion</a>}
    </div></section>
  );

  const myLead = leads.find((l) => l.email && l.email === session?.email);
  const myMember = members.find((m) => m.email && m.email === session?.email);
  const badge = (v) => <span className={`badge badge--${TONES[v] || "info"}`}>{v}</span>;

  const space = (
    <div className="wrap space">
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
        {coachs.length === 0 ? <p>La liste des coachs sera bientôt disponible.</p> :
          <div className="coachlist">{coachs.map((c) => <div key={c.id}><b>{c.nom}</b><p>{c.specialite}</p><p>{c.dispo}</p></div>)}</div>}</div>
    </div>
  );

  const field = (icon, props) => <div className="field"><Line>{icon}</Line><input {...props} aria-label={props.placeholder} /></div>;
  const plain = (props) => <input className="plain" {...props} aria-label={props.placeholder} />;
  const err = error && <p className="err" role="alert">{error}</p>;

  const panel = session ? (
    <><h3>Bonjour, {session.nom}</h3>
      <p>{role === "admin" ? "Vous êtes connecté en administrateur." : "Vous êtes connecté. Retrouvez votre suivi dans votre espace."}</p>
      <button className="btn btn--full" onClick={logout}>Se déconnecter</button></>
  ) : mode === "client" ? (
    <form onSubmit={signup}><h3>Créer un compte</h3>
      <p>Inscrivez-vous pour suivre votre candidature.</p>
      {plain({ name: "nom", placeholder: "Nom complet", autoComplete: "name", required: true })}
      {plain({ name: "email", type: "email", placeholder: "E-mail", autoComplete: "email", required: true })}
      {plain({ name: "tel", type: "tel", placeholder: "Téléphone", autoComplete: "tel", required: true })}
      <select className="plain" name="objectif" aria-label="Votre objectif">{OBJECTIFS.map((o) => <option key={o}>{o}</option>)}</select>
      {plain({ name: "pw", type: "password", placeholder: "Mot de passe (6 caractères minimum)", autoComplete: "new-password", required: true })}
      {err}<button className="btn btn--full" type="submit">Créer mon compte</button>
      <p className="alt"><button type="button" className="linkbtn" onClick={() => switchMode("login")}>J'ai déjà un compte</button></p></form>
  ) : (
    <form onSubmit={login}><h3>Accéder à votre espace</h3>
      <p>Connectez-vous pour gérer votre salle de sport.</p>
      {field(userLine, { name: "id", placeholder: "Identifiant", autoComplete: "username", required: true })}
      {field(lockLine, { name: "pw", type: "password", placeholder: "Mot de passe", autoComplete: "current-password", required: true })}
      {err}<button className="btn btn--full" type="submit">Se connecter</button>
      <p className="alt">
        <button type="button" className="linkbtn" onClick={() => switchMode("client")}>Créer un compte client</button>
      </p></form>
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
        <div className="hero__art" aria-hidden="true"><Dumbbell h={220} color="#232b3b" /></div>
        <img className="hero__img" src={HERO} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="hero__shade" />
        <div className="hero__in">
          <h1>Méga <b>Gym</b></h1>
          <h2>Gestion des inscriptions, des candidats et des coachs</h2>
          <p>Une application web simple et efficace pour gérer facilement votre salle de sport.</p>
          {session ? <a className="btn btn--lg" href={role === "admin" ? "#/inscriptions" : "#/mon-espace"}>Commencer <Arrow size={20} /></a>
            : <button className="btn btn--lg" onClick={goLogin}>Commencer <Arrow size={20} /></button>}
        </div>
      </header>
      <section className="wrap home">
        {role === "client" ? (
          <a className="card" href="#/mon-espace"><span className="ico ico--red"><Solid>{person}</Solid></span>
            <h3>Mon espace</h3><p>Suivez votre candidature, votre abonnement et découvrez nos coachs.</p><span className="go go--red"><Arrow /></span></a>
        ) : (<>
          <a className="card" href="#/inscriptions"><span className="ico ico--red"><Solid>{person}</Solid></span>
            <h3>Inscriptions</h3><p>Gérez les nouvelles inscriptions des membres à la salle.</p><span className="go go--red"><Arrow /></span></a>
          <a className="card" href="#/candidats"><span className="ico ico--blue"><Solid>{group}</Solid></span>
            <h3>Candidats</h3><p>Suivez les candidatures et gérez les informations des futurs membres.</p><span className="go go--blue"><Arrow /></span></a>
          <a className="card" href="#/coachs"><span className="ico ico--green"><Solid>{person}</Solid></span>
            <h3>Coachs</h3><p>Gérez les coachs et leurs disponibilités.</p><span className="go go--green"><Arrow /></span></a>
        </>)}
        <div className="card login" id="acces"><Dumbbell h={26} />{panel}</div>
      </section>
    </>
  );

  return (
    <>
      <nav className="top"><div className="top__in">
        <a className="logo" href="#/"><Dumbbell h={34} />Méga <b>Gym</b></a>
        <div className="nav">
          <a href="#/" className={route === "#/" ? "on" : ""}>Accueil</a>
          {role === "client" ? <a href="#/mon-espace" className={route === "#/mon-espace" ? "on" : ""}>Mon espace</a>
            : [["#/inscriptions", "Inscriptions"], ["#/candidats", "Candidats"], ["#/coachs", "Coachs"]].map(([h, t]) => <a key={h} href={h} className={route === h ? "on" : ""}>{t}</a>)}
        </div>
        {session ? <button className="btn btn--line" onClick={logout}><Line>{userLine}</Line>Se déconnecter</button>
          : <a className="btn btn--line" href="#/" onClick={goLogin}><Line>{userLine}</Line>Se connecter</a>}
      </div></nav>
      <main>{page}</main>
      <footer className="foot"><b>Méga Gym</b> &nbsp; © {new Date().getFullYear()}. Tous droits réservés.</footer>
    </>
  );
}
