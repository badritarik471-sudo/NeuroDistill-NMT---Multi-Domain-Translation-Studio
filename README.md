# NeuroDistill NMT — 5 Agents Traducteurs Spécialisés

**Créateur :** Tarik Badri — **Associé :** Larbi Badri  
**Référence scientifique :** Mghabbar & Ratnamogan, *« Building a Multi-domain Neural Machine Translation Model using Knowledge Distillation »*, ECAI 2020.

---

## Les 5 Agents Traducteurs
1. **FINANCE :** Comptabilité, IFRS, audit, marchés. Avertissement : « aucun conseil en investissement ».
2. **BANQUE :** Crédit, comptes, paiements, TAEG, IBAN intacts. Avertissement : « aucun conseil de crédit ».
3. **TECHNOLOGIE & INFORMATIQUE :** Documentation, API, réseaux. Ne jamais traduire code, CLI, endpoints.
4. **DROIT & CONFORMITÉ :** Contrats, statuts, RGPD. Modaux stricts (*shall/may*), avertissement assermenté.
5. **SANTÉ & MÉDECINE :** Doses, unités, fréquences JAMAIS approximées, molécules DCI, [À VÉRIFIER]. Avertissement : « aucun avis médical ».

---

## Deux Mécanismes d'Apprentissage Distincts
- **Mécanisme 1 — Mémoire de connaissances (Immédiat) :** Ingestion PDF/Word/scan (même monolingue), anonymisation automatique (IBAN, noms, identifiants), extraction de termes candidats, glossaire proposé à la validation utilisateur (modifiable, supprimable), RAG local.
- **Mécanisme 2 — Réentraînement du professeur (ECAI 2020 Algorithm 1) :** Uniquement à partir de données bilingues alignées validées. Sélection dynamique CED (éq. 9-11), Professeur sans lissage (Hard teacher §4.6), Top-K cibles douces (§4.4), Étudiant multi-domaine (mot-level, $\lambda=0.7$). Garantie stricte AUCUNE RÉGRESSION avec rollback automatique.

---

## Démarrage Rapide (Windows & macOS)

### Windows 10 / 11 :
```cmd
desktop\run_windows.bat
```

### macOS & Linux :
```bash
chmod +x desktop/run_mac.sh
./desktop/run_mac.sh
```

---

## Crédits & Mentions Légales
- **Créé par Tarik Badri — en association avec Larbi Badri.**
- **Référence scientifique :** Idriss Mghabbar & Pirashanth Ratnamogan (BNP Paribas, ECAI 2020).
- **Moteur OCR Indra :** Datalab (`datalab-to/indra`).
