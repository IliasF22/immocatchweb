/**
 * Formulaire « Extrait gratuit de ma ville ».
 *
 * Envoie les champs en JSON au webhook n8n, dont l'adresse vient de
 * `VITE_EXTRAIT_WEBHOOK_URL` (fichier .env). Sans JavaScript, le formulaire
 * garde son envoi classique vers la même adresse : rien n'est perdu.
 *
 * Le même fragment HTML est inclus sur plusieurs pages : on branche donc tous
 * les formulaires marqués `data-formulaire-extrait`.
 */
import { envoyerEvenement } from "./analytics.js";

const ADRESSE = import.meta.env.VITE_EXTRAIT_WEBHOOK_URL;
const DELAI_MAX_MS = 15000;

export function initialiserFormulaires() {
  document.querySelectorAll("[data-formulaire-extrait]").forEach(brancher);
}

function brancher(formulaire) {
  const bouton = formulaire.querySelector('button[type="submit"]');
  const statut = formulaire.querySelector(".formulaire__statut");
  const merci = formulaire.parentElement.querySelector(".formulaire__merci");

  function afficherMerci() {
    formulaire.hidden = true;
    if (merci) {
      merci.hidden = false;
      // Le focus suit le message : un lecteur d'écran l'annonce, et sur
      // mobile il reste à l'écran au lieu d'un formulaire disparu.
      merci.focus();
    }
  }

  formulaire.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    // Validation native : messages dans la langue du navigateur, et focus
    // placé sur le premier champ à corriger.
    if (!formulaire.reportValidity()) return;

    const champs = new FormData(formulaire);

    // Piège rempli : c'est un robot. On lui montre le même message qu'à un
    // humain, pour ne pas lui apprendre que le piège existe.
    if (champs.get("site_web")) {
      afficherMerci();
      return;
    }

    const donnees = {
      agence: texte(champs, "agence"),
      nom: texte(champs, "nom"),
      ville: texte(champs, "ville"),
      telephone: texte(champs, "telephone"),
      email: texte(champs, "email"),
      consentement: champs.get("consentement") === "oui",
      page: window.location.pathname,
      envoye_le: new Date().toISOString(),
    };

    bouton.disabled = true;
    statut.dataset.etat = "";
    statut.textContent = "Envoi en cours…";

    const annulation = new AbortController();
    const minuteur = setTimeout(() => annulation.abort(), DELAI_MAX_MS);

    try {
      const reponse = await fetch(ADRESSE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
        signal: annulation.signal,
      });
      if (!reponse.ok) throw new Error(`Réponse ${reponse.status}`);

      envoyerEvenement("extrait_demande", { page: donnees.page });
      statut.textContent = "";
      afficherMerci();
    } catch (erreur) {
      console.warn("Envoi du formulaire impossible.", erreur);
      statut.dataset.etat = "erreur";
      statut.textContent =
        "L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous à ilias@immocatch.fr.";
      bouton.disabled = false;
    } finally {
      clearTimeout(minuteur);
    }
  });
}

function texte(champs, nom) {
  return String(champs.get(nom) || "").trim();
}
