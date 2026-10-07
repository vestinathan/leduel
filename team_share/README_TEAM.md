# 📊 Hackathon Mistral - Données pour l'Équipe

## 🎯 Recommandation
**Implanter dans l'arrondissment 17** - Score: 100.0/100

---

## 📁 Contenu de ce dossier

| Fichier | Description |
|---------|-------------|
| `index.html` | Page web interactive avec tableau et recommandation |
| `paris_hairdresser_scoring.csv` | Données complètes au format CSV |
| `paris_hairdresser_scoring.json` | Données complètes au format JSON |
| `heatmap_hexbin.html` | Heatmap hexagonale (Folium) |
| `heatmap_h3.html` | Heatmap H3 (Uber) |
| `kepler_config.json` | Configuration Kepler.gl |
| `kepler_visualization.ipynb` | Notebook Kepler.gl |
| `recommandation.txt` | Recommandation détaillée |

---

## 🏆 Top 5 Arrondissements

1. **Arrondissement 17** - Score: 100.0/100 (Gap: 1.68e+07)
2. **Arrondissement 20** - Score: 74.0/100 (Gap: 1.26e+07)
3. **Arrondissement 19** - Score: 68.9/100 (Gap: 1.18e+07)
4. **Arrondissement 18** - Score: 64.2/100 (Gap: 1.10e+07)
5. **Arrondissement 16** - Score: 62.2/100 (Gap: 1.07e+07)

---

## 📊 Métriques

- **Gap Score** = demand_score / (supply_score + 1)
- **Demand Score** = population × revenu_median × (trends_score / 100)
- **Supply Score** = nb_salons × avg_rating
- **Final Score** = (gap_score × 0.7) + (accessibility × 0.2) + (cost × 0.1)

---

## 🚀 Comment utiliser

### Option 1: Ouvrir la page web
```bash
# Double-cliquez simplement sur index.html
# Ou depuis un terminal:
open team_share/index.html
```

### Option 2: Utiliser les données brutes
- **CSV**: Importez dans Excel, Google Sheets, ou votre outil préféré
- **JSON**: Utilisez avec votre application web ou backend

### Option 3: Visualisations avancées
- **heatmap_hexbin.html**: Carte interactive avec Folium
- **kepler_visualization.ipynb**: Notebook Kepler.gl (nécessite Jupyter installé)

---

## 📅 Date de génération
Generated: 2026-10-07 20:32:01
