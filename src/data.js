export const OBJECTIFS = ["Remise en forme", "Perte de poids", "Prise de masse", "Préparation sportive"];

export const MESSAGES = {
  Nouveau: "Nous avons bien reçu votre demande. Un coach vous contactera bientôt.",
  "Contacté": "Nous vous avons contacté. Répondez-nous pour fixer une séance d'essai.",
  "Séance d'essai": "Votre séance d'essai est prévue. Présentez-vous à l'accueil de la salle.",
  "Accepté": "Votre candidature est acceptée. La salle finalise votre inscription.",
  "Refusé": "Votre candidature n'a pas été retenue pour le moment.",
};

export const TONES = {
  Actif: "ok", "Accepté": "ok",
  "En attente": "warn", "Contacté": "warn",
  Nouveau: "info", "Séance d'essai": "info",
  "Expiré": "bad", "Refusé": "bad",
};

export const memberFields = (coachs) => [
  { k: "nom", label: "Nom complet", required: true },
  { k: "email", label: "E-mail", type: "email" },
  { k: "telephone", label: "Téléphone", type: "tel" },
  { k: "formule", label: "Formule", options: ["Mensuel", "Trimestriel", "Annuel"] },
  { k: "coach", label: "Coach", options: ["—", ...coachs.map((c) => c.nom)] },
  { k: "debut", label: "Début", type: "date" },
  { k: "statut", label: "Statut", options: ["Actif", "En attente", "Expiré"], badge: true },
];

export const leadFields = [
  { k: "nom", label: "Nom complet", required: true },
  { k: "email", label: "E-mail", type: "email" },
  { k: "telephone", label: "Téléphone", type: "tel" },
  { k: "objectif", label: "Objectif", options: OBJECTIFS },
  { k: "statut", label: "Statut", options: ["Nouveau", "Contacté", "Séance d'essai", "Accepté", "Refusé"], badge: true },
  { k: "note", label: "Note" },
];

export const coachFields = [
  { k: "nom", label: "Nom complet", required: true },
  { k: "specialite", label: "Spécialité" },
  { k: "dispo", label: "Disponibilités" },
];

// Aucune donnée de démonstration : l'espace démarre vide.
export const SEED = { members: [], leads: [], coachs: [] };
