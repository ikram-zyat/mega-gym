import { useState } from "react";
import { TONES } from "./data.js";

const show = (f, v) =>
  f.type === "date" && v ? new Date(v).toLocaleDateString("fr-FR") : v || "—";

// Tableau + formulaire : ajouter, modifier, supprimer, rechercher.
export default function Manager({ title, noun, fields, items, setItems, rowAction }) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.k, f.options ? f.options[0] : ""]));
  const [form, setForm] = useState(null);
  const [q, setQ] = useState("");
  const shown = items.filter((i) => Object.values(i).join(" ").toLowerCase().includes(q.toLowerCase()));

  const save = (e) => {
    e.preventDefault();
    setItems(form.id ? items.map((i) => (i.id === form.id ? form : i)) : [{ ...form, id: Date.now() }, ...items]);
    setForm(null);
  };
  const remove = (i) => window.confirm(`Supprimer ${i.nom} ?`) && setItems(items.filter((x) => x.id !== i.id));

  return (
    <section className="wrap">
      <div className="bar">
        <h2>{title} <span className="count">{items.length}</span></h2>
        <input className="search" type="search" placeholder="Rechercher" aria-label="Rechercher" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={() => setForm(blank())}>Ajouter {noun}</button>
      </div>

      {form && (
        <form className="card form" onSubmit={save}>
          <h3>{form.id ? "Modifier" : "Ajouter"} {noun}</h3>
          <div className="fields">
            {fields.map((f) => (
              <label key={f.k}>{f.label}
                {f.options ? (
                  <select value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type || "text"} required={f.required} value={form[f.k] || ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                )}
              </label>
            ))}
          </div>
          <div className="actions">
            <button className="btn" type="submit">Enregistrer</button>
            <button className="btn btn--ghost" type="button" onClick={() => setForm(null)}>Annuler</button>
          </div>
        </form>
      )}

      <div className="tablebox">
        <table>
          <thead><tr>{fields.map((f) => <th key={f.k}>{f.label}</th>)}<th></th></tr></thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i.id}>
                {fields.map((f) => (
                  <td key={f.k}>{f.badge ? <span className={`badge badge--${TONES[i[f.k]] || "info"}`}>{i[f.k]}</span> : show(f, i[f.k])}</td>
                ))}
                <td className="rowact">
                  {rowAction && rowAction(i)}
                  <button className="btn btn--ghost btn--sm" onClick={() => setForm(i)}>Modifier</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => remove(i)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <p className="empty">{items.length ? "Aucun résultat pour cette recherche." : `Aucun enregistrement. Cliquez sur « Ajouter ${noun} » pour commencer.`}</p>
        )}
      </div>
    </section>
  );
}
