let sketch = function(p) {
    let isSimulating = false;
    let time = 0;
    let force = 10;
    let mass = 1;
    let initialVelocity = 0;
    let position = 0;
    let velocity = 0;
    let work = 0;
    let dt = 0.016; // Time step (1/60 seconds)
    
    // Arrays to store data for charts
    let positionData = [];
    let velocityData = [];
    let timeData = [];
    
    p.setup = function() {
        console.log('Setting up canvas...');
        let canvas = p.createCanvas(600, 200);
        canvas.parent('physics-canvas');
        p.background(248, 249, 250);
        console.log('Canvas setup complete');
        resetSimulation();
    };
    
    p.draw = function() {
        // Clear the canvas
        p.background(248, 249, 250);
        
        // Draw track
        p.stroke(200);
        p.strokeWeight(2);
        p.line(50, p.height/2, p.width-50, p.height/2);
        
        // Draw ball
        p.fill(52, 152, 219);
        p.noStroke();
        // Scale position for visualization (1 meter = 10 pixels)
        let visualPosition = position % ((p.width-100)/10); // Loop position within track
        let ballX = p.constrain(50 + visualPosition * 10, 50, p.width-50);
        p.ellipse(ballX, p.height/2, 30, 30);
        
        // Draw velocity vector
        if (isSimulating) {
            p.stroke(231, 76, 60);
            p.strokeWeight(2);
            let velocityScale = 2; // Scale velocity for visualization
            p.line(ballX, p.height/2, ballX + velocity * velocityScale, p.height/2);
            // Draw arrowhead
            p.line(ballX + velocity * velocityScale, p.height/2, 
                   ballX + velocity * velocityScale - 5, p.height/2 - 5);
            p.line(ballX + velocity * velocityScale, p.height/2, 
                   ballX + velocity * velocityScale - 5, p.height/2 + 5);
        }
        
        if (isSimulating) {
            updatePhysics();
            updateCharts();
        }
    };
    
    function updatePhysics() {
        // Calculate acceleration (F = ma)
        const acceleration = force / mass;
        
        // Calculate exact solutions for constant acceleration
        time += dt;
        velocity = initialVelocity + acceleration * time;
        position = initialVelocity * time + 0.5 * acceleration * time * time;
        
        // Calculate work done (W = F·d)
        work = force * position; // For constant force, work is force times displacement
        
        // Update UI with formatted numbers
        if (document.getElementById('position')) {
            document.getElementById('position').textContent = position.toFixed(2);
            document.getElementById('velocity').textContent = velocity.toFixed(2);
            document.getElementById('work').textContent = work.toFixed(2);
        }
        
        // Store data for charts (limit data points to prevent memory issues)
        const maxDataPoints = 300;
        if (timeData.length >= maxDataPoints) {
            timeData.shift();
            positionData.shift();
            velocityData.shift();
        }
        timeData.push(time);
        positionData.push(position);
        velocityData.push(velocity);
    }
    
    function updateCharts() {
        if (window.updatePositionChart && window.updateVelocityChart) {
            window.updatePositionChart(timeData, positionData);
            window.updateVelocityChart(timeData, velocityData);
        }
    }
    
    function resetSimulation() {
        console.log('Resetting simulation...');
        time = 0;
        position = 0;
        velocity = initialVelocity;
        work = 0;
        positionData = [];
        velocityData = [];
        timeData = [];
        isSimulating = false;
        
        // Reset UI
        if (document.getElementById('position')) {
            document.getElementById('position').textContent = '0.00';
            document.getElementById('velocity').textContent = initialVelocity.toFixed(2);
            document.getElementById('work').textContent = '0.00';
        }
        
        // Reset charts
        if (window.resetCharts) {
            window.resetCharts();
        }
    }
    
    // Make resetSimulation accessible globally
    window.resetSimulation = resetSimulation;
    
    // Update physics parameters from UI
    window.updatePhysicsParams = function(params) {
        console.log('Updating physics params:', params);
        force = params.force;
        mass = params.mass;
        initialVelocity = params.initialVelocity;
        resetSimulation();
    };
    
    // Start/stop simulation
    window.toggleSimulation = function() {
        console.log('Toggling simulation. Current state:', isSimulating);
        isSimulating = !isSimulating;
    };
};

// Initialize p5 sketch
console.log('Initializing p5 sketch...');
new p5(sketch); 