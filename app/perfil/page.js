"use client";

import { useState } from "react";
import { MAX_CONTACTS, bloodGroups, emptyProfile } from "@/lib/data";
import { NEEDS, describePrefs } from "@/lib/prefs";
import Link from "next/link";
import { usePrefs } from "@/components/PrefsProvider";
import { useStored } from "@/lib/store";

// Teléfono → enlace tel:. En España, 9 cifras sin prefijo llevan +34.
const telHref = (n) => {
  const clean = n.replace(/[^\d+]/g, "");
  return "tel:" + (clean.startsWith("+") || clean.length !== 9 ? clean : "+34" + clean);
};

const hasContent = (p) => p.name.trim() || p.contacts.some((c) => c.phone.trim());

function formatBirth(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function Row({ label, value }) {
  if (!value || !String(value).trim()) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function Perfil() {
  const [stored, setStored, ready] = useStored("star:profile", emptyProfile);
  const [editing, setEditing] = useState(null); // null = decide según los datos guardados
  const [draft, setDraft] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);
  const { prefs } = usePrefs();

  if (!ready) return <h1>👤 Mi perfil</h1>;

  // Perfiles guardados antes de añadir un campo siguen funcionando.
  const profile = { ...emptyProfile, ...stored, contacts: stored.contacts?.length ? stored.contacts : emptyProfile.contacts };
  const isEditing = editing ?? !hasContent(profile);
  const callable = profile.contacts.filter((c) => c.phone.trim());

  function startEdit() {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setSaved(false);
    setEditing(true);
  }
  function save(e) {
    e.preventDefault();
    const cleaned = { ...draft, contacts: draft.contacts.filter((c) => c.name.trim() || c.phone.trim()) };
    setStored(cleaned.contacts.length ? cleaned : { ...cleaned, contacts: emptyProfile.contacts });
    setEditing(false);
    setSaved(true);
  }
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const setContact = (i, key) => (e) =>
    setDraft((d) => ({ ...d, contacts: d.contacts.map((c, j) => (j === i ? { ...c, [key]: e.target.value } : c)) }));
  const addContact = () =>
    setDraft((d) => ({ ...d, contacts: [...d.contacts, { name: "", relation: "", phone: "" }] }));
  const removeContact = (i) => setDraft((d) => ({ ...d, contacts: d.contacts.filter((_, j) => j !== i) }));

  return (
    <>
      <h1>👤 Mi perfil</h1>

      <section className="sos-box" aria-labelledby="sos-title">
        <h2 id="sos-title" className="sr-only">
          Ayuda urgente
        </h2>
        <a className="sos-btn" href="tel:112">
          🆘 SOS: llamar al 112
          <small>Emergencias · gratis · 24 horas</small>
        </a>
        {callable.map((c, i) => (
          <a key={i} className="btn call-btn" href={telHref(c.phone)}>
            📞 Llamar a {c.name || "mi contacto"}
            {c.relation ? ` (${c.relation})` : ""} · {c.phone}
          </a>
        ))}
        <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
          Este botón abre el teléfono para llamar. Tienes que pulsar “llamar” tú. En un ordenador sin
          teléfono, marca el 112 desde tu móvil.
        </p>
      </section>

      {saved && !isEditing && (
        <p className="notice" role="status">
          ✅ Perfil guardado.
        </p>
      )}

      {isEditing ? (
        <form className="form" onSubmit={save} aria-label="Editar perfil">
          {!hasContent(profile) && (
            <p className="notice" role="note">
              Rellena lo que quieras. Todo es opcional. Esta información puede ayudar a otras personas si
              tienes una emergencia.
            </p>
          )}
          <p className="notice" role="note">
            🔒 Tus datos se guardan solo en este dispositivo. No se envían a ningún sitio ni los ve nadie
            más de STAR.
          </p>

          <fieldset className="card" style={{ border: "2px solid var(--border)" }}>
            <legend>
              <h2 style={{ margin: 0 }}>Mis datos</h2>
            </legend>
            <div className="form">
              <div className="field">
                <label htmlFor="name">Nombre y apellidos</label>
                <input id="name" value={draft.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="nickname">¿Cómo te gusta que te llamen?</label>
                <input id="nickname" value={draft.nickname} onChange={set("nickname")} />
              </div>
              <div className="field">
                <label htmlFor="birth">Fecha de nacimiento</label>
                <input id="birth" type="date" value={draft.birthDate} onChange={set("birthDate")} />
              </div>
              <div className="field">
                <label htmlFor="phone">Mi teléfono</label>
                <input id="phone" type="tel" inputMode="tel" value={draft.phone} onChange={set("phone")} autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="address">Dónde vivo</label>
                <input id="address" value={draft.address} onChange={set("address")} autoComplete="street-address" />
              </div>
            </div>
          </fieldset>

          <fieldset className="card" style={{ border: "2px solid var(--border)" }}>
            <legend>
              <h2 style={{ margin: 0 }}>Mi salud</h2>
            </legend>
            <div className="form">
              <div className="field">
                <label htmlFor="blood">Grupo sanguíneo</label>
                <select id="blood" value={draft.bloodGroup} onChange={set("bloodGroup")}>
                  {bloodGroups.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="allergies">Alergias</label>
                <p className="hint">Por ejemplo: penicilina, frutos secos, látex.</p>
                <textarea id="allergies" value={draft.allergies} onChange={set("allergies")} />
              </div>
              <div className="field">
                <label htmlFor="meds">Medicinas que tomo</label>
                <p className="hint">Nombre, cantidad y a qué hora.</p>
                <textarea id="meds" value={draft.medications} onChange={set("medications")} />
              </div>
              <div className="field">
                <label htmlFor="conds">Condiciones de salud</label>
                <p className="hint">Por ejemplo: síndrome de Down, autismo, epilepsia, diabetes.</p>
                <textarea id="conds" value={draft.conditions} onChange={set("conditions")} />
              </div>
              <div className="field">
                <label htmlFor="card">Número de tarjeta sanitaria</label>
                <input id="card" value={draft.healthCard} onChange={set("healthCard")} />
              </div>
              <div className="field">
                <label htmlFor="doctor">Mi médico o centro de salud</label>
                <input id="doctor" value={draft.doctor} onChange={set("doctor")} />
              </div>
              <div className="field">
                <label htmlFor="help">Cómo pueden ayudarme</label>
                <p className="hint">
                  Por ejemplo: “Háblame despacio”, “Me asustan los ruidos fuertes”, “Necesito que me
                  expliques lo que pasa”.
                </p>
                <textarea id="help" value={draft.howToHelp} onChange={set("howToHelp")} />
              </div>
            </div>
          </fieldset>

          <fieldset className="card" style={{ border: "2px solid var(--border)" }}>
            <legend>
              <h2 style={{ margin: 0 }}>Contactos de emergencia</h2>
            </legend>
            <div className="form">
              {draft.contacts.map((c, i) => (
                <div key={i} className="contact-edit">
                  <div className="field">
                    <label htmlFor={`c-name-${i}`}>Nombre</label>
                    <input id={`c-name-${i}`} value={c.name} onChange={setContact(i, "name")} />
                  </div>
                  <div className="field">
                    <label htmlFor={`c-rel-${i}`}>Quién es</label>
                    <input
                      id={`c-rel-${i}`}
                      value={c.relation}
                      onChange={setContact(i, "relation")}
                      placeholder="Madre, padre, hermano, cuidador…"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`c-tel-${i}`}>Teléfono</label>
                    <input
                      id={`c-tel-${i}`}
                      type="tel"
                      inputMode="tel"
                      value={c.phone}
                      onChange={setContact(i, "phone")}
                    />
                  </div>
                  {draft.contacts.length > 1 && (
                    <button type="button" className="btn btn-small" onClick={() => removeContact(i)}>
                      🗑️ Quitar este contacto
                    </button>
                  )}
                </div>
              ))}
              {draft.contacts.length < MAX_CONTACTS && (
                <button type="button" className="btn" onClick={addContact}>
                  ➕ Añadir otro contacto
                </button>
              )}
            </div>
          </fieldset>

          <div className="card-actions">
            <button type="submit" className="btn btn-primary">
              💾 Guardar
            </button>
            {hasContent(profile) && (
              <button type="button" className="btn" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <>
          <div className="profile-grid">
            <article className="card" aria-labelledby="datos-title">
              <h2 id="datos-title">🪪 Mis datos</h2>
              <dl className="info-list">
                <Row label="Nombre" value={profile.name} />
                <Row label="Me gusta que me llamen" value={profile.nickname} />
                <Row label="Fecha de nacimiento" value={formatBirth(profile.birthDate)} />
                <Row label="Mi teléfono" value={profile.phone} />
                <Row label="Dónde vivo" value={profile.address} />
              </dl>
            </article>

            <article className="card" aria-labelledby="salud-title">
              <h2 id="salud-title">🩺 Mi salud</h2>
              <dl className="info-list">
                <div>
                  <dt>Grupo sanguíneo</dt>
                  <dd>
                    {profile.bloodGroup === "No lo sé" ? (
                      "No lo sé"
                    ) : (
                      <span className="blood" aria-label={`Grupo sanguíneo ${profile.bloodGroup}`}>
                        {profile.bloodGroup}
                      </span>
                    )}
                  </dd>
                </div>
                <Row label="Alergias" value={profile.allergies} />
                <Row label="Medicinas" value={profile.medications} />
                <Row label="Condiciones de salud" value={profile.conditions} />
                <Row label="Tarjeta sanitaria" value={profile.healthCard} />
                <Row label="Médico o centro de salud" value={profile.doctor} />
                <Row label="Cómo pueden ayudarme" value={profile.howToHelp} />
              </dl>
            </article>

            <article className="card" aria-labelledby="contactos-title">
              <h2 id="contactos-title">📞 Contactos de emergencia</h2>
              {callable.length === 0 ? (
                <p className="muted">Todavía no has añadido ninguno.</p>
              ) : (
                <ul className="contact">
                  {callable.map((c, i) => (
                    <li key={i}>
                      <strong>{c.name || "Contacto"}</strong>
                      {c.relation ? ` · ${c.relation}` : ""}
                      <br />
                      📞 <a href={telHref(c.phone)}>{c.phone}</a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <article className="card" aria-labelledby="adapt-title" style={{ marginTop: "1rem" }}>
            <h2 id="adapt-title">⚙️ Cómo uso la página</h2>
            {prefs.needs.length > 0 && (
              <p>
                {prefs.needs
                  .map((id) => NEEDS.find((n) => n.id === id))
                  .filter(Boolean)
                  .map((n) => (
                    <span key={n.id} className="tag">
                      {n.title}
                    </span>
                  ))}
              </p>
            )}
            {describePrefs(prefs).length ? (
              <ul className="changes" style={{ marginTop: 0 }}>
                {describePrefs(prefs).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">La página está como siempre.</p>
            )}
            <div className="card-actions">
              <Link className="btn" href="/adaptar">
                Cambiar cómo se ve la página
              </Link>
            </div>
          </article>

          <div className="card-actions" style={{ marginTop: "1.25rem" }}>
            <button type="button" className="btn btn-primary" onClick={startEdit}>
              ✏️ Editar mi perfil
            </button>
          </div>
        </>
      )}
    </>
  );
}
