/**
 * Mistral - Duel des Idées
 * UI moderne + Flow simplifié : Intuition → Raison → Pari → Duel → Décision
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const APP_STATE = {
    currentStep: 1,
    selectedArr: null,
    selectedReasons: [],
    selectedCriteria: [],
    confidenceLevel: 8,
    allData: [],
    recommendation: null,
    resultState: null
};

// ============================================================================
// DONNÉES
// ============================================================================

const TOP_ARRONDISSEMENTS = [
    { num: 17, name: "17ème" },
    { num: 20, name: "20ème" },
    { num: 19, name: "19ème" },
    { num: 18, name: "18ème" },
    { num: 16, name: "16ème" },
    { num: 15, name: "15ème" },
    { num: 14, name: "14ème" },
    { num: 13, name: "13ème" }
];

const REASONS = [
    { id: "connaissance", icon: "👍", label: "Je connais bien ce quartier" },
    { id: "recommandation", icon: "🎯", label: "On me l'a recommandé" },
    { id: "potentiel", icon: "🚀", label: "Potentiel non exploité" },
    { id: "clientèle", icon: "💼", label: "Clientèle cible présente" },
    { id: "accessibilité", icon: "🚇", label: "Bonne desserte transports" },
    { id: "prix", icon: "💰", label: "Prix immobilier raisonnable" }
];

const CRITERIA = [
    { id: "concurrence", label: "Peu de concurrence", measurable: true },
    { id: "population", label: "Densité de population", measurable: true },
    { id: "revenu", label: "Niveau de revenu", measurable: true },
    { id: "tendance", label: "Tendance de recherche", measurable: true },
    { id: "prix", label: "Prix des loyers", measurable: true },
    { id: "access", label: "Accessibilité", measurable: true }
];

// ============================================================================
// ÉLÉMENTS DOM
// ============================================================================

const E = {
    progressBar: document.getElementById('progressBar'),
    // Étape 1
    choices: document.getElementById('choices'),
    customChoice: document.getElementById('customChoice'),
    submitCustom: document.getElementById('submitCustom'),
    error1: document.getElementById('error1'),
    // Étape 2
    chosenArr: document.getElementById('chosenArr'),
    reasonsGrid: document.getElementById('reasonsGrid'),
    criteriaGrid: document.getElementById('criteriaGrid'),
    error2: document.getElementById('error2'),
    // Étape 3
    confidenceSlider: document.getElementById('confidenceSlider'),
    confidenceValue: document.getElementById('confidenceValue'),
    // Étape 4
    duelTitle: document.getElementById('duelTitle'),
    duelSubtitle: document.getElementById('duelSubtitle'),
    intuitionCard: document.getElementById('intuitionCard'),
    dataCard: document.getElementById('dataCard'),
    resultDetails: document.getElementById('resultDetails'),
    topList: document.getElementById('topList'),
    // Étape 5
    decisionTitle: document.getElementById('decisionTitle'),
    decisionOptions: document.getElementById('decisionOptions'),
    summaryBox: document.getElementById('summaryBox'),
    copySummary: document.getElementById('copySummary')
};

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

async function loadData() {
    // Essayer de charger depuis le fichier JSON
    try {
        const response = await fetch('team_share/paris_hairdresser_scoring.json');
        if (response.ok) {
            const data = await response.json();
            APP_STATE.allData = data.data;
            APP_STATE.recommendation = data.recommendation;
            APP_STATE.allData.sort((a, b) => a.rank - b.rank);
            console.log('✅ Données chargées depuis le fichier JSON:', APP_STATE.allData.length, 'arrondissements');
            return true;
        }
    } catch (error) {
        console.log('⚠️ Fetch échoué, utilisation des données embeddées');
    }
    
    // Utiliser les données embeddées dans le HTML
    if (window.MISTRAL_DATA) {
        APP_STATE.allData = window.MISTRAL_DATA.data;
        APP_STATE.recommendation = window.MISTRAL_DATA.recommendation;
        APP_STATE.allData.sort((a, b) => a.rank - b.rank);
        console.log('✅ Données chargées depuis le HTML:', APP_STATE.allData.length, 'arrondissements');
        return true;
    }
    
    // Ultime secours : données hardcodées
    console.warn('❌ Aucune source de données trouvée, utilisation des données de secours');
    APP_STATE.allData = generateFallbackData();
    APP_STATE.recommendation = { best: 17, gap_score: 16818146, final_score: 11772702, reason: "Meilleur ratio" };
    return false;
}

function generateFallbackData() {
    return [
        { rank: 1, arrondissement: 17, population: 168590, revenu_median: 65000, trends_score: 95, nb_salons: 150, avg_rating: 4.12, final_score_normalized: 100.0 },
        { rank: 2, arrondissement: 20, population: 197336, revenu_median: 47000, trends_score: 85, nb_salons: 150, avg_rating: 4.17, final_score_normalized: 74.0 },
        { rank: 3, arrondissement: 19, population: 184680, revenu_median: 45000, trends_score: 82, nb_salons: 140, avg_rating: 4.13, final_score_normalized: 68.9 },
        { rank: 4, arrondissement: 18, population: 196589, revenu_median: 48000, trends_score: 88, nb_salons: 180, avg_rating: 4.19, final_score_normalized: 64.2 },
        { rank: 5, arrondissement: 16, population: 160793, revenu_median: 62000, trends_score: 98, nb_salons: 220, avg_rating: 4.16, final_score_normalized: 62.2 }
    ].map((d, i) => ({ ...d, gap_score: d.final_score_normalized * 100000 }));
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function updateProgress(step) {
    APP_STATE.currentStep = step;
    const progress = (step / 4) * 100;
    E.progressBar.style.width = `${progress}%`;
    
    // Masquer toutes les étapes
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`step${i}`).classList.remove('active');
    }
    // Afficher l'étape active
    document.getElementById(`step${step}`).classList.add('active');
}

function showError(step, message) {
    const el = step === 1 ? E.error1 : E.error2;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

function formatNumber(n) {
    return new Intl.NumberFormat('fr-FR').format(n);
}

function formatScore(s) {
    return s.toFixed(1);
}

// ============================================================================
// ÉTAPE 1 : CHOIX
// ============================================================================

function initStep1() {
    // Générer les boutons des arrondissements
    E.choices.innerHTML = '';
    TOP_ARRONDISSEMENTS.forEach(arr => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="arr">${arr.num}</span><span class="name">${arr.name}</span>`;
        btn.onclick = () => selectArrondissement(arr.num);
        E.choices.appendChild(btn);
    });
    
    // Bouton personnalisé
    E.submitCustom.onclick = () => {
        const num = parseInt(E.customChoice.value);
        if (num >= 1 && num <= 20) {
            selectArrondissement(num);
        } else {
            showError(1, 'Entrez un numéro entre 1 et 20');
        }
    };
    
    // Entrée claire
    E.customChoice.onkeypress = (e) => {
        if (e.key === 'Enter') E.submitCustom.click();
    };
}

function selectArrondissement(num) {
    APP_STATE.selectedArr = num;
    
    // Sélectionner visuellement
    const choices = E.choices.querySelectorAll('.choice-btn');
    choices.forEach(btn => {
        const btnNum = parseInt(btn.querySelector('.arr').textContent);
        btn.classList.toggle('selected', btnNum === num);
    });
    
    updateProgress(2);
    initStep2();
}

// ============================================================================
// ÉTAPE 2 : RAISONS
// ============================================================================

function initStep2() {
    E.chosenArr.textContent = `${APP_STATE.selectedArr}`;
    
    // Générer les raisons
    E.reasonsGrid.innerHTML = '';
    REASONS.forEach(reason => {
        const btn = document.createElement('button');
        btn.className = 'reason-btn';
        btn.innerHTML = `<span class="icon">${reason.icon}</span>${reason.label}`;
        btn.onclick = () => toggleReason(reason.id);
        E.reasonsGrid.appendChild(btn);
        
        // Sélectionner si déjà choisi
        if (APP_STATE.selectedReasons.includes(reason.id)) {
            btn.classList.add('selected');
        }
    });
    
    // Générer les critères
    E.criteriaGrid.innerHTML = '';
    CRITERIA.forEach(criteria => {
        const item = document.createElement('div');
        item.className = 'criteria-item';
        item.innerHTML = `
            <input type="checkbox" id="crit_${criteria.id}" ${APP_STATE.selectedCriteria.includes(criteria.id) ? 'checked' : ''}>
            <label for="crit_${criteria.id}">${criteria.label}</label>
            ${criteria.measurable ? '' : '<span class="badge">Non mesurable</span>'}
        `;
        E.criteriaGrid.appendChild(item);
        
        item.onclick = () => {
            item.classList.toggle('selected');
            const cb = item.querySelector('input');
            cb.checked = !cb.checked;
            toggleCriteria(criteria.id);
        };
    });
    
    // Boutons de navigation pour l'étape 2
    const nextBtn2 = document.getElementById('nextBtn2');
    if (nextBtn2) {
        nextBtn2.onclick = () => {
            updateProgress(3);
            initStep3();
        };
    }
    
    const backBtn2 = document.getElementById('backBtn2');
    if (backBtn2) {
        backBtn2.onclick = () => {
            updateProgress(1);
            initStep1();
        };
    }
}

function toggleReason(id) {
    const index = APP_STATE.selectedReasons.indexOf(id);
    if (index > -1) {
        APP_STATE.selectedReasons.splice(index, 1);
    } else {
        APP_STATE.selectedReasons.push(id);
    }
    
    // Sélectionner visuellement
    const btns = E.reasonsGrid.querySelectorAll('.reason-btn');
    btns.forEach(btn => {
        const btnId = REASONS.findIndex(r => r.label === btn.textContent.trim().slice(2));
        if (btnId > -1) {
            btn.classList.toggle('selected', APP_STATE.selectedReasons.includes(REASONS[btnId].id));
        }
    });
}

function toggleCriteria(id) {
    const index = APP_STATE.selectedCriteria.indexOf(id);
    if (index > -1) {
        APP_STATE.selectedCriteria.splice(index, 1);
    } else {
        APP_STATE.selectedCriteria.push(id);
    }
}

// ============================================================================
// ÉTAPE 3 : CONFIANCE
// ============================================================================

function initStep3() {
    E.confidenceSlider.value = APP_STATE.confidenceLevel;
    E.confidenceValue.textContent = APP_STATE.confidenceLevel;
    
    E.confidenceSlider.oninput = () => {
        APP_STATE.confidenceLevel = parseInt(E.confidenceSlider.value);
        E.confidenceValue.textContent = APP_STATE.confidenceLevel;
    };
    
    // Boutons de navigation pour l'étape 3
    const nextBtn3 = document.getElementById('nextBtn3');
    if (nextBtn3) {
        nextBtn3.onclick = () => {
            updateProgress(4);
            initStep4();
        };
    }
    
    const backBtn3 = document.getElementById('backBtn3');
    if (backBtn3) {
        backBtn3.onclick = () => {
            updateProgress(2);
            initStep2();
        };
    }
}

// ============================================================================
// ÉTAPE 4 : DUEL
// ============================================================================

function initStep4() {
    const userArr = APP_STATE.allData.find(d => d.arrondissement === APP_STATE.selectedArr);
    const recommendedArr = APP_STATE.allData[0];
    
    // Déterminer l'état
    const state = determineState(userArr, recommendedArr);
    APP_STATE.resultState = state;
    
    // Mettre à jour les titres
    E.duelTitle.textContent = state.title;
    E.duelSubtitle.textContent = state.subtitle;
    
    // Générer les cartes
    generateIntuitionCard(userArr);
    generateDataCard(recommendedArr);
    
    // Générer les détails
    generateResultDetails(userArr, recommendedArr);
    
    // Générer le top 5
    generateTopList();
    
    // Boutons de navigation
    const backBtn4 = document.getElementById('backBtn4');
    if (backBtn4) {
        backBtn4.onclick = () => {
            updateProgress(3);
            initStep3();
        };
    }
    
    const nextBtn4 = document.getElementById('nextBtn4');
    if (nextBtn4) {
        nextBtn4.onclick = () => {
            updateProgress(5);
            initStep5();
        };
    }
}

function determineState(userArr, recommendedArr) {
    if (!userArr || !recommendedArr) {
        return { title: 'Erreur', subtitle: 'Données non disponibles', state: 'error' };
    }
    
    if (userArr.arrondissement === recommendedArr.arrondissement) {
        const second = APP_STATE.allData[1];
        const diff = userArr.final_score_normalized - second.final_score_normalized;
        return {
            title: `✅ Votre intuition était juste !`,
            subtitle: `L'arrondissement ${userArr.arrondissement} est en tête avec ${formatScore(diff)} points d'avance.`,
            state: 'confirm'
        };
    }
    
    const scoreDiff = Math.abs(userArr.final_score_normalized - recommendedArr.final_score_normalized);
    
    if (scoreDiff < 15) {
        return {
            title: `⚠️ Match serré !`,
            subtitle: `L'écart entre ${userArr.arrondissement} et ${recommendedArr.arrondissement} est de seulement ${formatScore(scoreDiff)} points.`,
            state: 'proximity'
        };
    }
    
    return {
        title: `🎯 Les données remettent en question votre choix`,
        subtitle: `L'arrondissement ${recommendedArr.arrondissement} devance ${userArr.arrondissement} de ${formatScore(scoreDiff)} points.`,
        state: 'close'
    };
}

function generateIntuitionCard(arr) {
    if (!arr) {
        E.intuitionCard.innerHTML = '<p>Données non disponibles</p>';
        return;
    }
    
    const confidenceLevel = getConfidenceLevel(arr);
    
    E.intuitionCard.innerHTML = `
        <div class="card-attribute">
            <span class="label">Arrondissement</span>
            <span class="value">${arr.arrondissement}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Rang</span>
            <span class="value">#${arr.rank}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Score</span>
            <span class="value">${formatScore(arr.final_score_normalized)}/100</span>
        </div>
        <div class="card-attribute">
            <span class="label">Votre confiance</span>
            <span class="value">${APP_STATE.confidenceLevel}/10</span>
        </div>
        <div class="card-attribute">
            <span class="label">Population</span>
            <span class="value">${formatNumber(arr.population)}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Revenu médian</span>
            <span class="value">${formatNumber(arr.revenu_median)}€</span>
        </div>
        <div class="card-attribute">
            <span class="label">Salons existants</span>
            <span class="value">${arr.nb_salons}</span>
        </div>
    `;
}

function generateDataCard(arr) {
    if (!arr) {
        E.dataCard.innerHTML = '<p>Données non disponibles</p>';
        return;
    }
    
    const confidenceLevel = getConfidenceLevel(arr);
    
    E.dataCard.innerHTML = `
        <div class="card-attribute">
            <span class="label">Arrondissement</span>
            <span class="value">${arr.arrondissement}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Rang</span>
            <span class="value">#${arr.rank}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Score</span>
            <span class="value">${formatScore(arr.final_score_normalized)}/100</span>
        </div>
        <div class="card-attribute">
            <span class="label">Confiance données</span>
            <span class="value">${confidenceLevel.text}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Population</span>
            <span class="value">${formatNumber(arr.population)}</span>
        </div>
        <div class="card-attribute">
            <span class="label">Revenu médian</span>
            <span class="value">${formatNumber(arr.revenu_median)}€</span>
        </div>
        <div class="card-attribute">
            <span class="label">Salons existants</span>
            <span class="value">${arr.nb_salons}</span>
        </div>
    `;
}

function getConfidenceLevel(arr) {
    const nbSalons = arr.nb_salons || 0;
    const score = arr.final_score_normalized || 0;
    const scoreDiff = Math.abs(score - 50);
    
    if (nbSalons >= 150 && scoreDiff >= 25) {
        return { level: 3, text: '●●● Élevée' };
    } else if (nbSalons >= 100 || scoreDiff >= 25) {
        return { level: 2, text: '●●○ Moyenne' };
    }
    return { level: 1, text: '●○○ Faible' };
}

function generateResultDetails(userArr, recommendedArr) {
    const state = APP_STATE.resultState;
    const userConfidence = APP_STATE.confidenceLevel;
    const scoreDiff = Math.abs(userArr.final_score_normalized - recommendedArr.final_score_normalized);
    
    let html = `
        <div class="result-message ${state.state}">
            <strong>${state.title}</strong>
            <p>${state.subtitle}</p>
    `;
    
    if (state.state === 'close') {
        html += `
            <p>Vous étiez sûr à <strong>${userConfidence}/10</strong>, mais les données placent l'arrondissement <strong>${recommendedArr.arrondissement}</strong> devant.</p>
            <p>Écart : <strong>${formatScore(scoreDiff)} points</strong>.</p>
        `;
    } else if (state.state === 'confirm') {
        const second = APP_STATE.allData[1];
        const advance = userArr.final_score_normalized - second.final_score_normalized;
        html += `
            <p>Votre choix devance l'arrondissement <strong>${second.arrondissement}</strong> de <strong>${formatScore(advance)} points</strong>.</p>
        `;
    } else if (state.state === 'proximity') {
        html += `
            <p>Seulement <strong>${formatScore(scoreDiff)} points</strong> séparent les deux arrondissements.</p>
            <p>Une vérification sur le terrain pourrait être utile.</p>
        `;
    }
    
    html += '</div>';
    E.resultDetails.innerHTML = html;
}

function generateTopList() {
    const top5 = APP_STATE.allData.slice(0, 5);
    
    let html = '<h3>Top 5 des arrondissements</h3><div class="top-grid">';
    
    top5.forEach((arr, index) => {
        const isSelected = arr.arrondissement === APP_STATE.selectedArr;
        const isRecommended = arr.rank === 1;
        
        html += `
            <div class="top-item ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}" onclick="toggleTopItem(${arr.arrondissement})">
                <span class="rank">${arr.rank}</span>
                <span class="info">
                    <span class="arr">Arr. ${arr.arrondissement}</span>
                    <span class="score">${formatScore(arr.final_score_normalized)}/100</span>
                </span>
            </div>
        `;
    });
    
    html += '</div>';
    E.topList.innerHTML = html;
}

function toggleTopItem(num) {
    // Fonction pour gérer le clic sur un top item
    console.log('Selected:', num);
}

// ============================================================================
// ÉTAPE 5 : DÉCISION
// ============================================================================

function initStep5() {
    const state = APP_STATE.resultState;
    const userArr = APP_STATE.allData.find(d => d.arrondissement === APP_STATE.selectedArr);
    const recommendedArr = APP_STATE.allData[0];
    
    // Titre selon l'état
    if (state.state === 'confirm') {
        E.decisionTitle.textContent = 'Que faites-vous ?';
    } else {
        E.decisionTitle.textContent = 'Quel est votre choix final ?';
    }
    
    // Générer les options
    E.decisionOptions.innerHTML = '';
    
    if (state.state === 'confirm') {
        // Si déjà en tête : confirmer ou vérifier
        [
            { id: 'confirm', label: `✅ Confirmer l'arrondissement ${userArr.arrondissement}`, value: 'confirm' },
            { id: 'verify', label: `🔍 Vérifier sur le terrain d'abord`, value: 'verify' }
        ].forEach(opt => createDecisionOption(opt));
    } else {
        // Sinon : garder, changer, vérifier
        [
            { id: 'keep', label: `🏠 Garder l'arrondissement ${userArr.arrondissement}`, value: 'keep' },
            { id: 'switch', label: `📈 Choisir l'arrondissement ${recommendedArr.arrondissement} (recommandé)`, value: 'switch' },
            { id: 'verify', label: `🔍 Vérifier sur le terrain d'abord`, value: 'verify' }
        ].forEach(opt => createDecisionOption(opt));
    }
    
    // Générer le résumé
    generateSummary();
    
    // Boutons de navigation pour l'étape 5
    const backBtn5 = document.getElementById('backBtn5');
    if (backBtn5) {
        backBtn5.onclick = () => {
            updateProgress(4);
            initStep4();
        };
    }
    
    // Bouton copier
    E.copySummary.onclick = () => {
        const text = E.summaryBox.textContent;
        navigator.clipboard.writeText(text).then(() => {
            E.copySummary.innerHTML = '✅ Copié !';
            setTimeout(() => {
                E.copySummary.innerHTML = '📋 Copier';
            }, 2000);
        });
    };
}

function createDecisionOption(opt) {
    const div = document.createElement('div');
    div.className = 'decision-option';
    div.innerHTML = `
        <div class="radio"></div>
        <label>${opt.label}</label>
        <span class="icon">${opt.id === 'confirm' || opt.id === 'keep' ? '✅' : opt.id === 'switch' ? '📊' : '🔍'}</span>
    `;
    
    div.onclick = () => {
        // Désélectionner tous
        document.querySelectorAll('.decision-option').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
        
        // Mettre à jour le résumé
        generateSummary(opt.value);
    };
    
    E.decisionOptions.appendChild(div);
}

function generateSummary(decision = null) {
    const userArr = APP_STATE.allData.find(d => d.arrondissement === APP_STATE.selectedArr);
    const recommendedArr = APP_STATE.allData[0];
    const state = APP_STATE.resultState;
    const now = new Date();
    
    let summary = `=== ANALYSE MISTRAL === ${now.toLocaleDateString('fr-FR')}

`;
    
    summary += `Votre intuition : Arrondissement ${userArr.arrondissement}
`;
    summary += `Confiance : ${APP_STATE.confidenceLevel}/10

`;
    
    summary += `Recommandation données : Arrondissement ${recommendedArr.arrondissement}
`;
    summary += `Score : ${formatScore(recommendedArr.final_score_normalized)}/100

`;
    
    summary += `État : ${state.title}
`;
    summary += `${state.subtitle}

`;
    
    if (decision) {
        const decisionText = {
            confirm: `DÉCISION : Confirmation de l'arrondissement ${userArr.arrondissement}`,
            keep: `DÉCISION : Maintien de l'arrondissement ${userArr.arrondissement} malgré les données`,
            switch: `DÉCISION : Changement vers l'arrondissement ${recommendedArr.arrondissement} (recommandé)`,
            verify: `DÉCISION : Vérification sur le terrain nécessaire`
        };
        summary += `${decisionText[decision]}

`;
    }
    
    if (APP_STATE.selectedReasons.length > 0) {
        summary += `Raisons : ${APP_STATE.selectedReasons.map(id => {
            const r = REASONS.find(r => r.id === id);
            return r ? r.label : id;
        }).join(', ')}

`;
    }
    
    if (APP_STATE.selectedCriteria.length > 0) {
        summary += `Critères : ${APP_STATE.selectedCriteria.map(id => {
            const c = CRITERIA.find(c => c.id === id);
            return c ? c.label : id;
        }).join(', ')}
`;
    }
    
    summary += `
--- Mistral Hackathon 2026 ---`;
    
    E.summaryBox.textContent = summary;
}

// ============================================================================
// NAVIGATION
// ============================================================================

function goToStep(step) {
    updateProgress(step);
    
    switch (step) {
        case 1: initStep1(); break;
        case 2: initStep2(); break;
        case 3: initStep3(); break;
        case 4: initStep4(); break;
        case 5: initStep5(); break;
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

async function init() {
    console.log('🚀 Initialisation...');
    
    // Charger les données
    await loadData();
    
    // Initialiser l'étape 1
    goToStep(1);
    
    // Écouter les boutons de navigation implicite
    // (Les boutons Next sont gérés automatiquement par le flow)
    
    console.log('✅ Application prête');
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', init);

// Exposer pour debugging
window.APP_STATE = APP_STATE;
window.goToStep = goToStep;
