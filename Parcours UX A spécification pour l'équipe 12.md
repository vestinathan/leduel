# Parcours UX A : spécification pour l'équipe 12

Oct 7, 2026 · @Brice Kieffer

## 1. Principes et parcours

Version 2 : le responsable réseau choisit une seule ville. Il écrit son intuition avant toute donnée, puis voit le face-à-face entre sa ville et celle que recommandent les données, avec la confiance et les manques de chacune (IDEA-03). L'effet recherché est un changement d'avis consenti, pas imposé. La maquette cliquable est l'artefact "De l'intuition au factuel" ; ce document en donne les textes, les règles et les contrats pour le Driver.

### Quatre principes

- **L'intuition d'abord.** Sans ville notée au départ, il n'y a pas d'écart à montrer. Le pari de confiance sur 10 sert de point de comparaison final.
- **Le calcul n'est jamais fait par Mistral.** Le score est déterministe ; Mistral interprète la question, écrit les explications et formule le pré-mortem.
- **Trois issues honnêtes.** La donnée peut confirmer la ville, ne pas la départager d'une autre, ou la placer derrière. Forcer un basculement serait malhonnête et le jury technique le verrait.
- **L'expertise terrain valide.** Si la ville choisie n'est pas en tête, un champ "ce que je sais et que la donnée ne voit pas" lui laisse la main (résistance RS1 du cadrage).

### Le parcours en 6 étapes

1. **Question.** Texte libre : "Où pensez-vous ouvrir votre prochain salon ?" Une commune de la liste candidate est reconnue dans la phrase.
2. **Cadrage.** Mistral reformule la question, l'utilisateur choisit ses critères et ses raisons. Les critères non mesurables ce soir sont annoncés comme tels.
3. **Pari.** Curseur de 1 à 10 : la confiance dans sa ville, avant de voir les données.
4. **Analyse.** Trace visible des appels : outils de données, calcul, puis les trois usages de Mistral.
5. **Résultat.** Face-à-face sa ville contre la première du classement, classement des 6 communes, fiche par commune avec confiance, manques et pré-mortem.
6. **Décision.** Garder sa ville, passer à la ville recommandée ou vérifier sur le terrain ; résumé copiable pour la direction.

### Où se trouvent les trois usages de Mistral

| Usage | Étape | Idée |
| --- | --- | --- |
| Interpréter la question et appeler les outils | 2 et 4 | IDEA-02 |
| Expliquer, donner la confiance et les manques | 5 | IDEA-03 |
| Pré-mortem de chaque implantation | 5 | IDEA-11 |

### Écarts avec le cadrage M1 à M5

Le cadrage et le document M6 parlent encore de 3 implantations (objectif O1, périmètre, livrable 2.1). Ce document les remplace par une seule ville choisie parmi les communes candidates. Le moteur chiffre toujours plusieurs communes, car il faut un classement pour comparer : l'indicateur K3 (au moins 3 villes chiffrées) reste valable. Le pitch passe de "classer 3 implantations" à "choisir la bonne ville" ; ces textes sont à aligner avant le dépôt.

## 2. Écran par écran

Chaque écran a un seul objectif et une seule action principale. Les textes ci-dessous sont ceux de la maquette.

| Étape | Titre affiché | Contenu et comportement | États et erreurs |
| --- | --- | --- | --- |
| 1. Question | "Où pensez-vous ouvrir votre prochain salon ?" | Zone de texte libre, raccourcis des 6 communes candidates (un toucher remplit "Je pense à X."), bouton "Utiliser l'exemple". La commune est reconnue sans accents ni casse. | Aucune commune : "Je n'ai reconnu aucune commune. Citez une commune de la liste ci-dessus." Plusieurs : "J'ai reconnu 2 communes (Annecy, Dijon). Il m'en faut une seule : gardez celle qui vous tient le plus à coeur." |
| 2. Cadrage | "Ce qui compte pour vous" | Bulle Mistral : "Vous voulez ouvrir un salon de coiffure et vous pensez à Annecy." Critères : peu de concurrence et beaucoup d'habitants (mesurés), clientèle aisée, jeune et loyer modéré (non mesurés). Raisons : je la connais bien, grande ville, recommandée, autre. | Un critère non mesuré choisi déclenche : "Je ne peux pas mesurer ce soir : … Je le signalerai comme donnée manquante." Aucun critère : les deux mesurés sont appliqués. |
| 3. Pari | "Avant de regarder les données, notez votre confiance" | Curseur de 1 à 10, valeur par défaut 8, grand chiffre ocre : "Je garde cette valeur et je vous la rappelle avec le résultat." | Valeur conservée si l'on revient en arrière. |
| 4. Analyse | "Analyse en cours" | 6 lignes toutes les 0,7 seconde : 3 appels Mistral, 2 outils de données, 1 calcul. Bouton "Passer" ; "Voir le résultat" apparaît à la fin. | Avec réduction des animations demandée par le système, tout s'affiche d'un coup. |
| 5. Résultat | Titre dynamique selon 3 états (voir ci-dessous) | Face-à-face en deux colonnes (votre intuition, ce que disent les données) avec rang, score, habitants par salon, salons comptés, confiance ; ligne d'écart ; classement des 6 communes ; 6 fiches repliables, celles de la ville choisie et de la première ouvertes. | Si la ville choisie est déjà en tête, la colonne de droite montre le challenger (la deuxième). |
| 6. Décision | "Votre décision" | Trois choix : garder sa ville, passer à la ville recommandée, vérifier sur le terrain d'abord. Liste à cocher des points à vérifier, champ "ce que je sais" quand on garde sa ville, résumé prêt à copier. | Si la ville est déjà en tête, seulement deux choix : confirmer, ou vérifier. Copie impossible : le texte est sélectionné et un message demande Ctrl+C. |

### Les trois états du résultat

| État | Condition | Titre | Message sous le titre |
| --- | --- | --- | --- |
| Confirmé | La ville choisie est 1re | "Les données confirment votre choix : Tours arrive en tête sur 6." | Confiance et avance sur la deuxième |
| Trop proche | Ville choisie derrière, écart de score inférieur à 0,15 | "Les données ne départagent pas nettement Besançon et Tours." | "L'écart de score est de 0,10, trop faible pour trancher sur ces seules données." |
| Écart | Ville choisie derrière, écart d'au moins 0,15 | "Les données placent Tours devant Annecy." | Pari rappelé ("Vous étiez sûr à 8 sur 10"), rang et score des deux villes |

Si la ville recommandée a une confiance Faible, la phrase "Attention : la confiance sur X est faible." est ajoutée. Le seuil de 0,15 est une hypothèse de la maquette, à valider.

### Contenu d'une fiche de commune (IDEA-03)

Chaque fiche contient, dans cet ordre : rang, nom, département, score ; niveau de confiance avec trois points (●●●, ●●○, ●○○) ; "Votre choix" ou "Recommandé" ; l'écart avec l'intuition quand la ville choisie n'est pas en tête ; la lecture du score ; la raison de la confiance ; au moins 3 manques ; le pré-mortem ; les sources. La confiance est exprimée par le texte et les points, jamais par la couleur seule.

### Identité visuelle

Deux couleurs portent le sens : ocre pour l'intuition, sarcelle pour la preuve. Elles se retrouvent dans les colonnes du face-à-face, les pastilles et les barres. Thèmes clair et sombre, lisible sur téléphone, focus clavier visible.

## 3. Règles de calcul et données attendues

Le score, la confiance et l'état du résultat sont trois règles simples, affichées et reproductibles. La maquette les exécute sur des chiffres illustratifs que le Driver remplace par les données réelles, sans changer la forme.

### Score offre/demande

```latex
\text{score}_i = \frac{\text{habitants}_i / \text{salons}_i}{610}
```

Au-dessus de 1,00, la commune est moins bien servie que la moyenne nationale d'environ 610 habitants par établissement (ordre de grandeur dérivé des sources du cadrage, à citer comme tel). Le classement trie les communes par score décroissant ; la première est la commune recommandée.

### État du résultat (une seule ville choisie)

| État | Règle |
| --- | --- |
| Confirmé | La ville choisie est la première du classement |
| Trop proche | La ville choisie est derrière, avec un écart de score de la première inférieur à 0,15 |
| Écart | La ville choisie est derrière, avec un écart d'au moins 0,15 |

Le seuil de 0,15 est une hypothèse de la maquette : il évite d'affirmer un classement que les données ne permettent pas de défendre.

### Niveau de confiance

| Niveau | Règle |
| --- | --- |
| Élevée (●●●) | Au moins 150 salons comptés ET un écart d'au moins 0,25 entre le score et 1,00 |
| Moyenne (●●○) | Au moins 100 salons comptés OU un écart d'au moins 0,25 |
| Faible (●○○) | Tous les autres cas |
| Ajustement | Une limite majeure connue (par exemple la saisonnalité touristique) abaisse le niveau d'un cran, sauf s'il est déjà Faible |

Les seuils 150, 100 et 0,25 sont des hypothèses de la maquette, à valider avec Mandy et Claire. L'important pour le jury est que la règle soit affichée et la même pour toutes les communes.

### Manques affichés (au moins 3 par résultat)

Un manque spécifique à la commune, puis : loyers et coût de l'emplacement ; flux piétons et accessibilité ; concurrence indirecte (coiffure à domicile, barbiers) ; taille et positionnement des salons ; établissements non diffusibles absents de l'API. Tout critère cité par l'utilisateur et non mesuré est ajouté à la liste.

### Contrat de données pour le Driver

La fonction d'analyse renvoie, pour chaque commune candidate, les champs suivants. La maquette contient déjà cet objet, marqué "TODO Driver".

| Champ | Type | Source |
| --- | --- | --- |
| nom, dep | texte | Liste des communes candidates |
| pop | entier | INSEE, population communale |
| salons | entier | API Recherche d'Entreprises, code NAF 96.02A et code postal, non diffusibles exclus |
| limite | booléen et texte | Limite majeure connue, écrite à la main pour chaque commune figée |

Plafond de sécurité du cadrage : jeu figé de 3 à 5 communes (6 dans la maquette, 3 au minimum pour que le classement ait un sens), 7 appels par seconde maximum sur l'API, extrait INSEE préparé avant 19h30. Si le comptage réel rate pour une commune, afficher "donnée indisponible" et une confiance Faible plutôt qu'un chiffre inventé.

## 4. Les trois appels Mistral

Chaque appel a une entrée fixe, une sortie structurée et un garde-fou. L'appel d'outils et les sorties structurées sont des capacités à confirmer sur la plateforme ce soir ; si elles manquent, demander du JSON dans le prompt et le valider côté code.

### Appel 1 : interpréter la question (étapes 1 à 2)

Entrée : le texte libre de l'utilisateur et la liste des communes candidates. Sortie attendue, avec une seule commune :

```json
{
  "commune": "Annecy",
  "raisons": ["connaissance personnelle"],
  "criteres": ["concurrence", "habitants"],
  "reformulation": "Vous voulez ouvrir un salon de coiffure et vous pensez à Annecy."
}
```

Garde-fou : une commune absente de la liste candidate est refusée et signalée, jamais inventée. Si aucune ou plusieurs communes sont trouvées, le code affiche le message d'erreur de l'étape 1.

### Appel 2 : expliquer le résultat (étape 5, IDEA-03)

Entrée : le tableau de résultats calculé par le code (score, rang, confiance, manques) pour toutes les communes, avec l'identifiant de la ville choisie. Consigne type :

> Tu rédiges pour un responsable réseau qui a choisi une ville. Utilise uniquement les chiffres fournis. N'effectue aucun calcul. Pour chaque commune, écris une phrase de lecture du score, explique le niveau de confiance en une phrase, et reprends la liste de manques fournie sans en retirer. Pour la ville choisie, indique en une phrase l'écart avec la première du classement. Si une donnée est absente, dis-le.

```json
{
  "communes": [
    { "nom": "Tours", "lecture": "...", "pourquoi_confiance": "...", "manques": ["...", "...", "..."] }
  ],
  "ecart_ville_choisie": "Annecy arrive 6e sur 6 ..."
}
```

Garde-fou (risque R6) : le code vérifie que tous les nombres cités dans le texte existent dans les données d'entrée, que chaque résultat a un niveau de confiance et au moins 3 manques, et que l'état du résultat (confirmé, trop proche, écart) vient du code et non du texte. Sinon, il affiche le gabarit de secours.

### Appel 3 : pré-mortem (étape 5, IDEA-11)

Entrée : une commune et ses chiffres. Consigne type :

> Imagine que ce salon a fermé après 18 mois. Donne les trois causes les plus probables en t'appuyant sur les chiffres fournis et sur les manques de données. Reste factuel, sans certitude.

```json
{ "nom": "Tours", "causes": ["...", "...", "..."] }
```

Garde-fou : le pré-mortem reste distinct de la liste des manques. Les manques disent ce qu'on ignore ; le pré-mortem dit comment cela pourrait mal tourner. Si l'interface les confond, le jury ne verra qu'un seul usage de Mistral.

### Traçabilité en démo

L'étape 4 montre pour chaque appel l'entrée, l'outil ou le modèle appelé et la sortie structurée. C'est la réponse au risque "Mistral perçu comme cosmétique" (R7). Le texte de secours de la maquette reste la solution de repli si l'API échoue pendant la démo (R5).

## 5. Cas de test et script de démo

Les 8 cas ci-dessous sont dérivés de l'intention et valent pour les chiffres illustratifs de la maquette : classement attendu Tours 1,49, Besançon 1,38, Dijon 1,28, Chambéry 1,16, Angers 1,04, Annecy 0,75. Dès que le Driver branche les vraies données, les cas 1 à 4 se réécrivent avec le nouveau classement ; les cas 5 à 8 restent identiques.

| # | Entrée | Résultat attendu |
| --- | --- | --- |
| 1 | "Annecy, parce que je la connais bien" | État écart : "Les données placent Tours devant Annecy." ; Annecy 6e, score 0,75 ; 0,74 d'écart ; fiche Annecy ouverte avec encadré d'écart ; trois choix en décision |
| 2 | "Tours" | État confirmé : "Les données confirment votre choix : Tours arrive en tête sur 6." ; avance de 0,10 sur Besançon ; deux choix seulement en décision |
| 3 | "Besançon" | État trop proche : "Les données ne départagent pas nettement Besançon et Tours." ; écart 0,10 |
| 4 | "Chambéry" | État écart ; Chambéry 4e, score 1,16, confiance Faible ; 0,33 d'écart en faveur de Tours |
| 5 | "chambery" (sans accent ni majuscule) | Commune reconnue, passage à l'étape 2 |
| 6 | "Annecy et Dijon" | Message d'erreur : 2 communes reconnues, il en faut une seule |
| 7 | "Lyon" | Message d'erreur : aucune commune reconnue ; Lyon n'est pas inventée |
| 8 | Critère "Loyer modéré" coché à l'étape 2, tout parcours | Les 6 fiches affichent une confiance et au moins 3 manques (indicateur K4 à 100 %), et "Loyer modéré (vous l'avez cité, non mesuré)" apparaît dans chacune |

### Script de démo de 3 minutes

| Temps | Action | Phrase à dire |
| --- | --- | --- |
| 0:00 à 0:30 | Étape 1, "Utiliser l'exemple" (Annecy), puis "Continuer" | "Le responsable réseau n'a pas le temps de compter. Il pense à une ville qu'il connaît." |
| 0:30 à 1:00 | Étape 2 et pari à 8 sur 10 | "Avant les données, il dit sa confiance. On la gardera." |
| 1:00 à 1:30 | Étape 4, montrer la trace | "Chaque appel est visible : ce que le code calcule, ce que Mistral écrit." |
| 1:30 à 2:30 | Étape 5 : titre, face-à-face, fiche d'Annecy puis de Tours | "Vous étiez sûr à 8 sur 10 et les données placent Tours devant Annecy. Voici pourquoi, avec la confiance et ce que la donnée ne dit pas." |
| 2:30 à 3:00 | Étape 6, "Vérifier sur le terrain d'abord", résumé | "L'outil ne remplace pas votre connaissance du terrain, il la met à l'épreuve." |

### Points de vigilance

- **Choisir le cas de démo après le calcul réel.** La ville intuitive doit être connue du responsable et ne pas être en tête avec au moins 0,15 d'écart, sinon l'état "écart" n'apparaît pas. Choisir le cas pour qu'il fasse effet en démo est acceptable à condition de le dire : c'est un cas, pas une preuve.
- **Montrer la limite d'Annecy dans la fiche** (saisonnalité touristique non mesurée). C'est là que l'expertise du responsable reprend la main, et c'est ce qui rend le message crédible.
- **Dire que les chiffres de la maquette sont illustratifs** tant que les vraies données ne sont pas branchées.
- **Ne jamais présenter 1,49 comme un prédicteur de chiffre d'affaires.** Le score dit où l'offre est plus faible, pas où un salon réussira.
