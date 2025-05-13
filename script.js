// Scenario configurations
const scenarios = {
    'projectile': {
        title: 'Projectile Motion',
        description: 'Simulate the motion of a projectile under gravity and air resistance.',
        equations: [
            'x(t) = v₀cos(θ)t',
            'y(t) = v₀sin(θ)t - ½gt²',
            'Range = v₀²sin(2θ)/g'
        ],
        xLabel: 'Distance (m)',
        yLabel: 'Height (m)'
    },
    'pendulum': {
        title: 'Swinging Pendulum',
        description: 'Visualize the simple harmonic motion of a pendulum.',
        equations: [
            'θ(t) = θ₀cos(√(g/L)t)',
            'T = 2π√(L/g)',
            'ω = √(g/L)'
        ],
        xLabel: 'Time (s)',
        yLabel: 'Angle (rad)'
    },
    'rocket': {
        title: 'Rocket Launch',
        description: 'Simulate a rocket launch with variable thrust and mass.',
        equations: [
            'F = ma',
            'v = v₀ + at',
            'y = y₀ + v₀t + ½at²'
        ],
        xLabel: 'Time (s)',
        yLabel: 'Height (m)'
    },
    'orbit': {
        title: 'Planetary Orbit',
        description: 'Visualize circular orbital motion.',
        equations: [
            'F = GMm/r²',
            'v = √(GM/r)',
            'T = 2π√(r³/GM)'
        ],
        xLabel: 'X Position (m)',
        yLabel: 'Y Position (m)'
    },
    'center-mass': {
        title: 'Center of Mass',
        description: 'Calculate and visualize the center of mass of a system.',
        equations: [
            'x_cm = Σ(mᵢxᵢ)/Σmᵢ',
            'y_cm = Σ(mᵢyᵢ)/Σmᵢ'
        ],
        xLabel: 'X Position (m)',
        yLabel: 'Y Position (m)'
    },
    'moment-inertia': {
        title: 'Moment of Inertia',
        description: 'Visualize the moment of inertia of a rotating system.',
        equations: [
            'I = Σ(mᵢrᵢ²)',
            'L = Iω',
            'T = ½Iω²'
        ],
        xLabel: 'Time (s)',
        yLabel: 'Angular Velocity (rad/s)'
    }
};

// Initialize charts
let positionChart, velocityChart;

function initializeCharts() {
    console.log('Initializing charts...');
    const positionCtx = document.getElementById('position-chart').getContext('2d');
    const velocityCtx = document.getElementById('velocity-chart').getContext('2d');
    
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            y: {
                title: {
                    display: true
                }
            }
        }
    };
    
    positionChart = new Chart(positionCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Position (m)',
                borderColor: 'rgb(52, 152, 219)',
                data: [],
                fill: false
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    ...chartOptions.scales.y,
                    title: {
                        ...chartOptions.scales.y.title,
                        text: 'Position (m)'
                    }
                }
            }
        }
    });
    
    velocityChart = new Chart(velocityCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Velocity (m/s)',
                borderColor: 'rgb(231, 76, 60)',
                data: [],
                fill: false
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    ...chartOptions.scales.y,
                    title: {
                        ...chartOptions.scales.y.title,
                        text: 'Velocity (m/s)'
                    }
                }
            }
        }
    });
    console.log('Charts initialized');
}

// Update position chart
window.updatePositionChart = function(timeData, positionData) {
    const data = timeData.map((t, i) => ({x: t, y: positionData[i]}));
    positionChart.data.datasets[0].data = data;
    positionChart.update();
};

// Update velocity chart
window.updateVelocityChart = function(timeData, velocityData) {
    const data = timeData.map((t, i) => ({x: t, y: velocityData[i]}));
    velocityChart.data.datasets[0].data = data;
    velocityChart.update();
};

// Reset charts
window.resetCharts = function() {
    positionChart.data.datasets[0].data = [];
    velocityChart.data.datasets[0].data = [];
    positionChart.update();
    velocityChart.update();
};

// Update scenario information
function updateScenarioInfo(scenario) {
    const info = scenarios[scenario];
    document.getElementById('scenario-title').textContent = info.title;
    document.getElementById('scenario-description').textContent = info.description;
    
    const equationsList = document.getElementById('physics-equations');
    equationsList.innerHTML = '';
    info.equations.forEach(eq => {
        const li = document.createElement('li');
        li.textContent = eq;
        equationsList.appendChild(li);
    });
    
    positionChart.options.scales.x.title.text = info.xLabel;
    positionChart.options.scales.y.title.text = info.yLabel;
    positionChart.update();
}

// Update physics parameters
function updatePhysicsParams() {
    console.log('Updating physics parameters...');
    const params = {
        force: parseFloat(document.getElementById('force').value),
        mass: parseFloat(document.getElementById('mass').value),
        initialVelocity: parseFloat(document.getElementById('initial-velocity').value)
    };
    
    if (window.updatePhysicsParams) {
        window.updatePhysicsParams(params);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    const playButton = document.getElementById('play-button');
    const resetButton = document.getElementById('reset-button');
    
    if (playButton && resetButton) {
        playButton.addEventListener('click', function() {
            console.log('Play button clicked');
            if (window.toggleSimulation) {
                window.toggleSimulation();
                this.textContent = this.textContent === 'Play' ? 'Stop' : 'Play';
            }
        });
        
        resetButton.addEventListener('click', function() {
            console.log('Reset button clicked');
            if (window.resetSimulation) {
                window.resetSimulation();
                document.getElementById('play-button').textContent = 'Play';
                isSimulating = false;
            }
        });
        
        // Add input event listeners
        document.getElementById('force').addEventListener('input', updatePhysicsParams);
        document.getElementById('mass').addEventListener('input', updatePhysicsParams);
        document.getElementById('initial-velocity').addEventListener('input', updatePhysicsParams);
        
        console.log('Event listeners initialized');
    }
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('info-modal');
    const btn = document.getElementById('info-button');
    const span = document.getElementsByClassName('close-button')[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    initializeCharts();
    initializeEventListeners();
    initializeModal();
    updatePhysicsParams();
}); 