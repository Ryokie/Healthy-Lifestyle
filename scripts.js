let interval;
let totalTime; // Total waktu dalam detik
let timeLeft; // Sisa waktu
let isPaused = false; // Status pause

// Fungsi untuk mengganti bahasa
const translations = {
    // ... your translations
};

// Fungsi untuk mengubah bahasa
function changeLanguage() {
    // ... your change language code
}

// Fungsi untuk memulai latihan
function startTraining() {
    totalTime = parseInt(document.getElementById('endurance-time').value); // Convert to integer
    timeLeft = totalTime; // Initialize timeLeft with totalTime
    const progressBar = document.getElementById('endurance-progress');
    const progressText = document.getElementById('endurance-progress-text');

    // Set progress bar maximum based on total time
    progressBar.max = totalTime;
    progressBar.value = totalTime;

    // Enable the buttons
    document.getElementById('pause-button').disabled = false; // Enable pause button
    document.getElementById('cancel-button').disabled = false; // Enable cancel button

    // Start the interval
    interval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            progressBar.value = timeLeft;
            updateProgressText(); // Update progress
        } else {
            clearInterval(interval);
            progressText.innerText = translations[language].trainingComplete;
            resetButtons(); // Reset buttons after training complete
        }
    }, 1000); // Menghitung setiap 1 detik
}

// Fungsi untuk memperbarui teks progres
function updateProgressText() {
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft % 60;
    const language = document.getElementById('language-select').value;

    // Update teks progres sesuai dengan bahasa yang dipilih
    const timeLeftText = language === 'id' 
        ? `Sisa Waktu: ${minutesLeft}m ${secondsLeft}s` 
        : `Time Left: ${minutesLeft}m ${secondsLeft}s`;

    document.getElementById('endurance-progress-text').innerText = timeLeftText;
}

// Fungsi untuk pause latihan
function pauseTraining() {
    const language = document.getElementById('language-select').value;

    if (isPaused) {
        // Resume training
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateProgressText(); // Update progress
            } else {
                clearInterval(interval);
                document.getElementById('endurance-progress-text').innerText = translations[language].trainingComplete;
                resetButtons(); // Reset buttons after training complete
            }
        }, 1000);
        isPaused = false;
        document.getElementById('pause-button').innerText = translations[language].pauseButton;
    } else {
        clearInterval(interval);
        isPaused = true;
        document.getElementById('pause-button').innerText = translations[language].startButton;
    }
}

// Fungsi untuk cancel latihan
function cancelTraining() {
    clearInterval(interval);
    timeLeft = 0; // Reset time left to zero
    document.getElementById('endurance-progress').value = 0; // Reset progress bar
    const language = document.getElementById('language-select').value;
    document.getElementById('endurance-progress-text').innerText = translations[language].trainingCanceled;
    resetButtons(); // Reset buttons after cancel
}

// Fungsi untuk reset tombol
function resetButtons() {
    document.getElementById('start-button').disabled = false; // Enable start button
    document.getElementById('pause-button').disabled = true; // Disable pause button
    document.getElementById('cancel-button').disabled = true; // Disable cancel button
    isPaused = false; // Reset pause status
}

// Muat bahasa saat halaman dimuat
window.onload = function() {
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default ke 'en' jika tidak ada
    document.getElementById('language-select').value = savedLanguage; // Set dropdown bahasa
    changeLanguage(); // Panggil fungsi untuk menerapkan bahasa
};

// Ideal Weight Calculation Function
function calculateIdealWeight() {
    const height = document.getElementById("height").value;
    const gender = document.getElementById("gender").value;
    let idealWeight;

    if (gender === "male") {
        idealWeight = (height - 100) * 0.9; // formula for men
    } else {
        idealWeight = (height - 100) * 0.85; // formula for women
    }

    document.getElementById("ideal-weight-result").innerText = `Your ideal weight is: ${idealWeight.toFixed(2)} kg`;
}

// Function to calculate calories needed to reach ideal weight
function calculateCalories() {
    const currentWeight = parseFloat(document.getElementById("current-weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;

    if (isNaN(currentWeight) || currentWeight <= 0 || isNaN(height) || height <= 0 || isNaN(age) || age <= 0) {
        alert("Please enter valid height, weight, and age.");
        return;
    }

    // BMR calculation
    let bmr;
    if (gender === "male") {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    // Activity level input
    const activityLevel = document.querySelector('input[name="activity-level"]:checked').value;
    let activityFactor;

    switch (activityLevel) {
        case "sedentary":
            activityFactor = 1.2;
            break;
        case "light":
            activityFactor = 1.375;
            break;
        case "moderate":
            activityFactor = 1.55;
            break;
        case "active":
            activityFactor = 1.725;
            break;
        case "very-active":
            activityFactor = 1.9;
            break;
        default:
            activityFactor = 1.2;
            break;
    }

    const dailyCaloricNeed = bmr * activityFactor;

    // Result display
    document.getElementById("calories-result").innerText = 
        `To maintain your current weight, you need approximately ${dailyCaloricNeed.toFixed(2)} calories per day.`;
}
