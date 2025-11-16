function calculateGauntlets() {
    var luck = parseFloat(document.getElementById("luck").value);
    var gauntletSpeed = parseFloat(document.getElementById("gauntletSpeed").value);
    var elementSpeed = parseFloat(document.getElementById("elementSpeed").value);
    var vip = parseFloat(document.getElementById("vip").value);

    if (isNaN(luck)) luck = 1;
    if (isNaN(elementSpeed)) elementSpeed = 0;

    var hastePotion = parseFloat(document.querySelector('input[name="hastePotion"]:checked').value);
    var ragePotion = parseFloat(document.querySelector('input[name="ragePotion"]:checked').value);
    var godlyPotion = parseFloat(document.querySelector('input[name="godlyPotion"]:checked').value);
    var seasonalPotion = parseFloat(document.querySelector('input[name="seasonalPotion"]:checked').value);

    var speedPotion = document.getElementById("speedPotion").checked ? 0.1 : 0;
    var transcendant = document.getElementById("transcendant").checked ? 10 : 0;
    var knowledgeOne = document.getElementById("knowledgeOne").checked ? 0.3 : 0;
    var knowledgeTwo = document.getElementById("knowledgeTwo").checked ? 0.4 : 0;
    var slothOne = document.getElementById("slothOne").checked ? -0.15 : 0;
    var slothTwo = document.getElementById("slothTwo").checked ? -0.25 : 0;
    var bank = document.getElementById("bank").checked ? 0.07 : 0;
    var xyz = document.getElementById("xyz").checked ? 2 : 1;

    var trsDecimal = gauntletSpeed / 100;
    var realElementSpeed = elementSpeed / 100;
    var trs = 1 + trsDecimal + speedPotion + knowledgeOne + knowledgeTwo + slothOne + slothTwo + seasonalPotion + bank + hastePotion + transcendant + realElementSpeed + ragePotion + godlyPotion;
    var trsJackpot = trs + 0.07;


    // Jackpot Gauntlet calculation
    var alJackpot = ((luck + (0.77 * xyz * vip) * 9) + ((luck + (0.77 * xyz * vip)) * 2)) / 10;
    var finalJackpotValue = alJackpot * (trsJackpot);

    // Gravitational Gauntlet calculation
    var alGrav = (((luck) * 9) + ((luck) * 6)) / 10;
    var finalGravValue = alGrav * trs;

    // Flesh Gauntlet calculation
    var alFlesh = (luck * 1.3);
    var finalFleshValue = alFlesh * trs;

    //Dark Shader calculation
    var alShader = ((((luck) * 2) * 4) + ((luck) * 16) + ((((luck) * 2) * 2.5) * 2) + (((luck) * 2.5) * 8)) / 30;
    var finalShaderValue = alShader * trs;

    //Pole Light Core calculation 
    var alPole = ((luck + (5 * xyz * vip)) * 6 + (luck + (5 * xyz * vip)) * 27)/(25 + ((((1)/(trs + 10)) * 5)/(((1)/(trs))))); 
    var finalPoleValue = alPole * trs;

    let bestGauntlet = "";
    let bestValue = Math.max(finalJackpotValue, finalGravValue, finalFleshValue, finalShaderValue, finalPoleValue);

    if (bestValue === finalJackpotValue) {
        bestGauntlet = "Jackpot Gauntlet";
    } else if (bestValue === finalGravValue) {
        bestGauntlet = "Gravitational Device";
    } else if (bestValue === finalFleshValue) {
        bestGauntlet = "Flesh Device";
    } else if (bestValue === finalShaderValue) {
        bestGauntlet = "Darkshader"
    } else if (bestValue === finalPoleValue) {
        bestGauntlet = "Pole Light Core Device"
    }

    // Display the results in the modal
    document.getElementById("modalResult").innerHTML = 
    `<h2 style="color: #2dd4bf; text-align: center;">Results</h2>
    <div class="results-section">
        <div class="result-line">
            <span class="highlight">Jackpot Gauntlet luck per second:</span> ${finalJackpotValue.toFixed(3)}
        </div>
        <div class="result-line">
            <span class="highlight">Flesh Device luck per second:</span> ${finalFleshValue.toFixed(3)}
        </div>
        <div class="result-line">
            <span class="highlight">Gravitational Device luck per second:</span> ${finalGravValue.toFixed(3)}
        </div>
        <div class="result-line">
            <span class="highlight">Darkshader luck per second:</span> ${finalShaderValue.toFixed(3)}
        </div>
        <div class="result-line">
            <span class="highlight">Pole Light Core Device luck per second:</span> ${finalPoleValue.toFixed(3)}
        </div>
    </div>
    <div class="results-section" style="margin-top: 20px;">
        <div class="result-line" style="background-color: #2d2d2d; border-left: 3px solid #2dd4bf;">
            <span style="color: #2dd4bf; font-size: 1.1em;">Best Choice:</span> ${bestGauntlet}
        </div>
    </div>`;

    // Show the modal
    document.getElementById("myModal").style.display = "block";
}

function calculateDifference() {
    // Get input values (excluding luck)
    var gauntletSpeed = parseFloat(document.getElementById("gauntletSpeed").value);
    var elementSpeed = parseFloat(document.getElementById("elementSpeed").value);
    var vip = parseFloat(document.getElementById("vip").value);

    // Handle invalid inputs
    if (isNaN(gauntletSpeed)) gauntletSpeed = 0;
    if (isNaN(elementSpeed)) elementSpeed = 0;
    if (isNaN(vip)) vip = 1;

    // Get values from radio buttons
    var hastePotion = parseFloat(document.querySelector('input[name="hastePotion"]:checked').value);
    var ragePotion = parseFloat(document.querySelector('input[name="ragePotion"]:checked').value);
    var godlyPotion = parseFloat(document.querySelector('input[name="godlyPotion"]:checked').value);
    var seasonalPotion = parseFloat(document.querySelector('input[name="seasonalPotion"]:checked').value);
    var knowledge = parseFloat(document.querySelector('input[name="knowledge"]:checked').value);

    // Get checkbox states with updated speed potion value (0.1)
    var speedPotion = document.getElementById("speedPotion").checked ? 0.1 : 0;
    var transcendant = document.getElementById("transcendant").checked ? 10 : 0;
    var bank = document.getElementById("bank").checked ? 0.07 : 0;
    var xyz = document.getElementById("xyz").checked ? 2 : 1;

    // Calculate True Roll Speeds with new potions
    var trsDecimal = gauntletSpeed / 100;
    var realElementSpeed = elementSpeed / 100;
    var trs = 1 + trsDecimal + speedPotion + knowledge + seasonalPotion + bank + hastePotion + transcendant + realElementSpeed + ragePotion + godlyPotion;
    var trsJackpot = trs + 0.07; // Jackpot has extra 0.07

    // Common constants
    var C = xyz * vip;
    
    // Calculate thresholds for each comparison
    // 1. Darkshader vs Pole Light Core
    var dsVsPole = (55 * C * (trs + 10)) / (7 * trs + 40);
    
    // 2. Jackpot vs Gravitational
    var jackVsGrav =  ((-0.847) * C * trsJackpot) / ((1.1 * trsJackpot) - (1.5 * trs));
    
    // 3. Flesh vs Gravitational
    var fleshVsGrav = 0; 
    
    // 4. Flesh vs Jackpot
    var fleshVsJack = ((0.847) * C * trsJackpot) / ((1.3 * trs) - (1.1 * trsJackpot));
    
    // 5. Darkshader vs Gravitational
    var dsVsGrav = 0;

    // Build result text
    var resultText = 
    `<h2 style="color: #2dd4bf; text-align: center">Gauntlet Comparison</h2>
    <p>The information is based on your provided values.</p>
    <p>The luck value is <span class="highlight">WITH L GAUNTLETS UNEQUIPPED.</span></p>
    <div class="results-section">
        <h3 style="color: #2dd4bf; margin: 0 0 5px;">Result</h3>
        <div class="result-line"><span class="highlight">Darkshader better than Pole at</span>: ${dsVsPole.toFixed(3)} luck</div>
        <div class="result-line""><span class="highlight">Gravitational better than Jackpot at</span>: ${jackVsGrav.toFixed(3)} luck</div>
        <div class="result-line""><span class="highlight">Flesh better than Jackpot at</span>: ${fleshVsJack.toFixed(3)} luck</div>
    </div>
    <div class="results-section">
        <h3 style="color: #2dd4bf">Other</h3>
        <div class="result-line"">✓ Gravitational is <span class="highlight">always</span> better than Flesh</div>
        <div class="result-line">✓ Darkshader is <span class="highlight">always</span> better than Gravitational</div>
        <div class="result-line">✓ Pole is <span class="highlight">always</span> better than all Gauntlets except Darkshader</div>
    </div>
    <div class="results-section">
        <h3 style="color: #2dd4bf">Information Used</h3>
        <div class="result-line">- Total Roll Speed: <span class="highlight">${trs.toFixed(2)}x</span></div>
        <div class="result-line">- VIP/VIP+? <span class="highlight">${document.getElementById('vip').options[document.getElementById('vip').selectedIndex].text}</span></div>
        <div class="result-line">- 2x luck (Dorcelessness) buff? <span class="highlight">${xyz === 2 ? 'Yes' : 'No'}</span></div>
    </div>`;

    document.getElementById("comparisonModal").style.display = "block";
    document.getElementById("modalComparison").innerHTML = resultText;
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function openToolsModal() {
    document.getElementById("toolsModal").style.display = "block";
}

function closeToolsModal() {
    document.getElementById("toolsModal").style.display = "none";
}

function openComparisonModal() {
    document.getElementById("comparisonModal").style.display = "block";
}

function closeComparisonModal() {
    document.getElementById("comparisonModal").style.display = "none";
}

window.onclick = function(event) {
    var modals = ['myModal', 'toolsModal', 'comparisonModal'];
    modals.forEach(function(modalId) {
        var modal = document.getElementById(modalId);
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    if (bgMusic.muted) {
        bgMusic.currentTime = 0;
        bgMusic.muted = false;
        bgMusic.play().catch(function(error) {
            console.log("Audio play failed:", error);
        });
        musicToggle.textContent = 'Stop Music';
    } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.muted = true;
        musicToggle.textContent = 'Play Music';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    
    // Set initial volume and play state
    bgMusic.volume = 0.09;
    bgMusic.play().catch(function(error) {
        console.log("Audio play failed:", error);
    });
});