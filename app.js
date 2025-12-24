// Global variables
let beatmapData = {};
let completedMaps = new Set();
let mapNotes = {};
let currentLevel = null;
let expandedCards = new Set();

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const btn = document.getElementById('themeToggle');
    btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('danProgress');
    const savedNotes = localStorage.getItem('danNotes');
    
    if (saved) {
        const data = JSON.parse(saved);
        completedMaps = new Set(data.completed || []);
        expandedCards = new Set(data.expanded || []);
    }
    
    if (savedNotes) {
        mapNotes = JSON.parse(savedNotes);
    }
}

// Save progress
function saveProgress() {
    const data = {
        completed: Array.from(completedMaps),
        expanded: Array.from(expandedCards)
    };
    localStorage.setItem('danProgress', JSON.stringify(data));
    localStorage.setItem('danNotes', JSON.stringify(mapNotes));
}

// Initialize the app
function init() {
    initTheme();
    loadProgress();
    
    if (typeof initialData !== 'undefined') {
        beatmapData = initialData;
    }
    
    generateLevelsList();
    updateOverallProgress();
    generateSkipOptions();
    setupEventListeners();
}

// Generate level buttons in sidebar
function generateLevelsList() {
    const container = document.getElementById('levelsList');
    container.innerHTML = '';
    
    const levelNames = Object.keys(beatmapData);
    
    levelNames.forEach((levelName, index) => {
        const maps = beatmapData[levelName];
        const completedCount = maps.filter(m => completedMaps.has(m.id)).length;
        const totalCount = maps.length;
        const percentage = Math.round((completedCount / totalCount) * 100);
        const isSkipped = mapNotes[`skipped_${levelName}`];
        
        // Calculate average star rating
        const avgSr = maps.reduce((sum, m) => sum + parseFloat(m.sr), 0) / maps.length;
        
        const btn = document.createElement('div');
        btn.className = `level-btn ${isSkipped ? 'skipped' : ''}`;
        btn.innerHTML = `
            <span>${levelName}</span>
            <span class="level-progress">${completedCount}/${totalCount} (${percentage}%) ★${avgSr.toFixed(2)}</span>
        `;
        btn.onclick = () => showLevel(levelName);
        container.appendChild(btn);
    });
}

// Show a specific level
function showLevel(levelName) {
    currentLevel = levelName;
    
    // Update active state in sidebar
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.level-btn')).find(
        btn => btn.textContent.includes(levelName)
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update header
    document.getElementById('currentLevelTitle').textContent = levelName;
    
    // Generate song cards
    generateSongCards(levelName);
}

// Generate song cards for a level
function generateSongCards(levelName) {
    const container = document.getElementById('trackerContent');
    const maps = beatmapData[levelName] || [];
    
    container.innerHTML = '';
    
    maps.forEach(map => {
        const isCompleted = completedMaps.has(map.id);
        const isExpanded = expandedCards.has(map.id);
        
        const card = document.createElement('div');
        card.className = `song-card ${isCompleted ? 'completed' : ''}`;
        card.id = `card-${map.id}`;
        
        const sr = parseFloat(map.sr);
        const stars = generateStarRating(sr);
        const bpm = parseInt(map.bpm);
        const cs = parseFloat(map.cs);
        const length = map.length;
        
        // Calculate CS circle size (higher CS = smaller circle)
        const circleSize = Math.max(16, 40 - (cs * 4));
        
        // Calculate length line width (in seconds)
        const [mins, secs] = length.split(':').map(Number);
        const totalSeconds = mins * 60 + secs;
        const lineWidth = Math.min(100, Math.max(20, totalSeconds / 5));
        
        // Calculate pendulum animation speed based on BPM
        const animationDuration = 60 / bpm;
        
        card.innerHTML = `
            <div class="song-card-header">
                <div class="checkbox-wrapper">
                    <div class="custom-checkbox ${isCompleted ? 'checked' : ''}" 
                         onclick="toggleComplete('${map.id}')"></div>
                </div>
                <div class="song-info">
                    <div class="song-name">
                        <a href="${map.url}" target="_blank">${map.name}</a>
                        ${map.mod !== 'N/A' ? `<span class="song-mod">${map.mod}</span>` : ''}
                    </div>
                    <button class="action-btn btn-notes" onclick="openNotesModal('${map.id}')">
                        📝 Notes
                    </button>
                </div>
            </div>
            
            <div class="song-stats">
                <div class="stat-display">
                    <span class="stat-label-small">Stars</span>
                    <div class="star-rating">
                        <span class="star-value">${sr.toFixed(2)}</span>
                        ${stars}
                    </div>
                </div>
                
                <div class="stat-display">
                    <span class="stat-label-small">BPM</span>
                    <div class="bpm-display">
                        <div class="bpm-pendulum" style="animation-duration: ${animationDuration.toFixed(2)}s"></div>
                        <span class="bpm-value">${bpm}</span>
                    </div>
                </div>
                
                <div class="stat-display">
                    <span class="stat-label-small">CS</span>
                    <div class="cs-display">
                        <div class="cs-circle" style="width: ${circleSize}px; height: ${circleSize}px;"></div>
                        <span class="cs-value">${cs}</span>
                    </div>
                </div>
                
                <div class="stat-display">
                    <span class="stat-label-small">Length</span>
                    <div class="length-display">
                        <div class="length-line" style="width: ${lineWidth}px;"></div>
                        <span class="length-value">${length}</span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Generate star rating display
function generateStarRating(sr) {
    const fullStars = Math.floor(sr);
    const hasHalf = sr % 1 >= 0.5;
    const totalStars = Math.ceil(sr);
    
    let html = '';
    for (let i = 0; i < totalStars; i++) {
        if (i < fullStars) {
            html += '<span class="star">★</span>';
        } else if (hasHalf && i === fullStars) {
            html += '<span class="star half">★</span>';
        } else {
            html += '<span class="star empty">☆</span>';
        }
    }
    return html;
}

// Toggle map completion
function toggleComplete(mapId) {
    if (completedMaps.has(mapId)) {
        completedMaps.delete(mapId);
    } else {
        completedMaps.add(mapId);
    }
    saveProgress();
    updateUI();
}

// Update UI after changes
function updateUI() {
    const card = document.querySelector(`[onclick="toggleComplete('${currentMapId}')"]`);
    if (card) {
        const mapId = card.getAttribute('data-map-id');
        card.classList.toggle('checked', completedMaps.has(mapId));
        const songCard = card.closest('.song-card');
        if (songCard) {
            songCard.classList.toggle('completed', completedMaps.has(mapId));
        }
    }
    
    updateOverallProgress();
    generateLevelsList();
    
    if (currentLevel) {
        showLevel(currentLevel);
    }
}

// Update overall progress
function updateOverallProgress() {
    let totalMaps = 0;
    let completed = 0;
    
    Object.values(beatmapData).forEach(maps => {
        totalMaps += maps.length;
        completed += maps.filter(m => completedMaps.has(m.id)).length;
    });
    
    const percentage = totalMaps > 0 ? Math.round((completed / totalMaps) * 100) : 0;
    
    document.getElementById('overallProgressBar').style.width = `${percentage}%`;
    document.getElementById('overallProgressBar').textContent = `${percentage}%`;
    document.getElementById('overallPercentage').textContent = `${percentage}% Complete`;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = totalMaps;
    document.getElementById('remainingCount').textContent = totalMaps - completed;
}

// Generate skip level options
function generateSkipOptions() {
    const select = document.getElementById('skipLevel');
    select.innerHTML = '';
    
    Object.keys(beatmapData).forEach((levelName, index) => {
        const option = document.createElement('option');
        option.value = levelName;
        option.textContent = levelName;
        select.appendChild(option);
    });
}

// Skip to level functionality
function skipToLevel() {
    const selectedLevel = document.getElementById('skipLevel').value;
    const levelNames = Object.keys(beatmapData);
    const selectedIndex = levelNames.indexOf(selectedLevel);
    
    if (selectedIndex <= 0) {
        alert('Cannot skip to the first level');
        return;
    }
    
    // Mark all maps in previous levels as complete
    for (let i = 0; i < selectedIndex; i++) {
        const levelName = levelNames[i];
        const maps = beatmapData[levelName];
        maps.forEach(map => {
            completedMaps.add(map.id);
        });
        // Mark level as skipped
        mapNotes[`skipped_${levelName}`] = true;
    }
    
    // Do NOT mark the selected level's maps as complete
    // Just navigate to it
    saveProgress();
    updateUI();
    showLevel(selectedLevel);
    
    alert(`Skipped to ${selectedLevel}! All previous levels marked as complete.`);
}

// Notes modal
let currentMapId = null;

function openNotesModal(mapId) {
    currentMapId = mapId;
    
    // Find map info
    let mapInfo = null;
    for (const level in beatmapData) {
        const found = beatmapData[level].find(m => m.id === mapId);
        if (found) {
            mapInfo = found;
            break;
        }
    }
    
    if (!mapInfo) return;
    
    document.getElementById('modalTitle').textContent = mapInfo.name;
    document.getElementById('modalMapInfo').innerHTML = `
        <p><strong>Star Rating:</strong> ${mapInfo.sr}</p>
        <p><strong>BPM:</strong> ${mapInfo.bpm}</p>
        <p><strong>AR:</strong> ${mapInfo.ar} | <strong>CS:</strong> ${mapInfo.cs} | <strong>OD:</strong> ${mapInfo.od}</p>
        <p><strong>Length:</strong> ${mapInfo.length}</p>
    `;
    document.getElementById('modalNotes').value = mapNotes[mapId] || '';
    document.getElementById('notesModal').classList.add('show');
}

function closeNotesModal() {
    document.getElementById('notesModal').classList.remove('show');
    currentMapId = null;
}

function saveModalNotes() {
    if (currentMapId) {
        const notes = document.getElementById('modalNotes').value;
        mapNotes[currentMapId] = notes;
        saveProgress();
        closeNotesModal();
    }
}

// Export progress
function exportProgress() {
    const data = {
        completed: Array.from(completedMaps),
        notes: mapNotes,
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dan-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import progress
function importProgress() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.completed) {
                completedMaps = new Set(data.completed);
            }
            
            if (data.notes) {
                mapNotes = data.notes;
            }
            
            saveProgress();
            updateUI();
            alert('Progress imported successfully!');
        } catch (error) {
            alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
    };
    reader.readAsText(file);
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        completedMaps.clear();
        mapNotes = {};
        expandedCards.clear();
        saveProgress();
        updateUI();
        alert('Progress has been reset.');
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('exportBtn').addEventListener('click', exportProgress);
    document.getElementById('importBtn').addEventListener('click', importProgress);
    document.getElementById('importFile').addEventListener('change', handleImport);
    document.getElementById('resetBtn').addEventListener('click', resetProgress);
    document.getElementById('skipToLevel').addEventListener('click', skipToLevel);
    
    // Close modal when clicking outside
    document.getElementById('notesModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeNotesModal();
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
