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

export const SEED = {
  members: [
    { id: 1, nom: "Yassine Benali", telephone: "0661 23 45 67", formule: "Annuel", coach: "Karim Bennani", debut: "2026-01-12", statut: "Actif" },
    { id: 2, nom: "Salma El Idrissi", telephone: "0662 98 10 22", formule: "Trimestriel", coach: "Nadia Lahlou", debut: "2026-08-03", statut: "Actif" },
    { id: 3, nom: "Omar Tazi", telephone: "0670 11 54 09", formule: "Mensuel", coach: "Hamza Chraibi", debut: "2026-09-15", statut: "En attente" },
    { id: 4, nom: "Khadija Amrani", telephone: "0655 40 31 78", formule: "Mensuel", coach: "—", debut: "2026-05-02", statut: "Expiré" },
  ],
  leads: [
    { id: 1, nom: "Mehdi Alaoui", telephone: "0664 71 20 33", objectif: "Prise de masse", statut: "Nouveau", note: "Contact via Instagram" },
    { id: 2, nom: "Imane Berrada", telephone: "0668 05 92 14", objectif: "Perte de poids", statut: "Séance d'essai", note: "Essai samedi 10h" },
    { id: 3, nom: "Anas Kabbaj", telephone: "0672 66 18 40", objectif: "Remise en forme", statut: "Contacté", note: "" },
  ],
  coachs: [
    { id: 1, nom: "Karim Bennani", specialite: "Musculation", dispo: "Lun – Ven, 8h – 14h" },
    { id: 2, nom: "Nadia Lahlou", specialite: "Fitness et cardio", dispo: "Mar – Sam, 14h – 21h" },
    { id: 3, nom: "Hamza Chraibi", specialite: "Boxe et CrossFit", dispo: "Lun, Mer, Ven, 17h – 22h" },
  ],
};
