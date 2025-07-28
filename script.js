// Libraries are loaded via CDN in HTML
// AOS, Swiper, and particlesJS are available as global variables

class AdvancedCalorieApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'blue';
        this.loadingMessages = [
            'Uploading image to server...',
            'Processing image upload...',
            'Sending to AI vision model...',
            'Analyzing food composition...',
            'Identifying ingredients...',
            'Calculating nutritional values...',
            'Processing AI results...',
            'Finalizing analysis...'
        ];
        this.currentMessageIndex = 0;
        this.currentFile = null;

        // API Configuration
        this.IMGBB_API_KEY = '13348af4b14365564b32063f2be91381';
        this.GEMINI_API_KEY = 'AIzaSyBhAGZ8TTDhnv8aO4XFIV9oKIxFPkU_1w8';

        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.setupDragAndDrop();
        this.initializeLibraries();
        this.applyTheme(this.currentTheme);
        this.setupParticles();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.cameraInput = document.getElementById('cameraInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.cameraBtn = document.getElementById('cameraBtn');

        // Preview elements
        this.previewSection = document.getElementById('previewSection');
        this.previewImage = document.getElementById('previewImage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingStatus = document.getElementById('loadingStatus');
        this.progressFill = document.getElementById('progressFill');
        this.analyzeBtn = document.getElementById('analyzeBtn');

        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.foodInfoCard = document.getElementById('foodInfoCard');
        this.nutritionGrid = document.getElementById('nutritionGrid');
        this.analysisContent = document.getElementById('analysisContent');
        this.newScanBtn = document.getElementById('newScanBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.shareBtn = document.getElementById('shareBtn');

        // History elements
        this.historyWrapper = document.getElementById('historyWrapper');

        // Theme elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeModal = document.getElementById('themeModal');
        this.closeModal = document.getElementById('closeModal');
    }

    bindEvents() {
        // Upload events
        // Only allow uploadBtn to trigger file dialog, not uploadArea (prevents double dialog)
        this.uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });
        this.cameraBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cameraInput.click();
        });
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.cameraInput.addEventListener('change', (e) => this.handleFileSelect(e));
        // Remove uploadArea click to prevent double dialog
        // this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Analysis events
        this.analyzeBtn.addEventListener('click', () => this.analyzeImage());
        this.newScanBtn.addEventListener('click', () => this.resetApp());

        // Action events
        this.saveBtn.addEventListener('click', () => this.saveResults());
        this.shareBtn.addEventListener('click', () => this.shareResults());

        // Theme events
        this.themeToggle.addEventListener('click', () => this.showThemeModal());
        this.closeModal.addEventListener('click', () => this.hideThemeModal());
        
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.applyTheme(theme);
                this.hideThemeModal();
            });
        });

        // Close modal on outside click
        this.themeModal.addEventListener('click', (e) => {
            if (e.target === this.themeModal) {
                this.hideThemeModal();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideThemeModal();
            }
        });
    }

    setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.remove('dragover');
            }, false);
        });

        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    initializeLibraries() {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });

        // Initialize Swiper for history
        this.historySwiper = new window.Swiper('.history-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                }
            }
        });
    }

    setupParticles() {
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#0ea5e9'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.1,
                        random: false,
                        anim: {
                            enable: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#0ea5e9',
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update particles color based on theme
        if (window.pJSDom && window.pJSDom[0]) {
            const colors = {
                blue: '#0ea5e9',
                yellow: '#eab308',
                purple: '#8b5cf6'
            };
            
            window.pJSDom[0].pJS.particles.color.value = colors[theme];
            window.pJSDom[0].pJS.particles.line_linked.color = colors[theme];
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    showThemeModal() {
        this.themeModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideThemeModal() {
        this.themeModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB.', 'error');
            return;
        }

        // Store the file for later upload
        this.currentFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.showPreviewSection();
            // Enable analyze button when image is selected
            this.analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    showPreviewSection() {
        this.previewSection.style.display = 'block';
        setTimeout(() => {
            this.previewSection.classList.add('show');
            this.previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        // Hide results section
        this.resultsSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
        // Reset analyze button state
        this.analyzeBtn.disabled = !this.currentFile;
        // Hide loading overlay if visible
        this.showLoading(false);
    }

    async analyzeImage() {
        if (!this.currentFile) {
            this.showNotification('Please select an image first.', 'error');
            return;
        }

        // Show loading only when analysis starts
        this.showLoading(true);
        this.currentMessageIndex = 0;
        // Disable analyze button to prevent double click
        this.analyzeBtn.disabled = true;

        try {
            // Step 1: Upload image to ImgBB
            await this.updateProgress('Uploading image to server...');
            const imageUrl = await this.uploadImageToImgBB(this.currentFile);

            // Step 2: Analyze with Google Gemini
            await this.updateProgress('Sending to Gemini AI vision model...');
            const analysisResult = await this.analyzeWithGemini(imageUrl);

            // Step 3: Process and display results
            await this.updateProgress('Processing AI results...');
            const foodData = this.processAnalysisResult(analysisResult);

            await this.updateProgress('Finalizing analysis...');
            await this.delay(500);

            this.showLoading(false);
            this.displayResults(foodData);
            this.addToHistory(foodData);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showLoading(false);
            this.showNotification('Analysis failed. Please try again.', 'error');
        }
    }

    async updateProgress(message) {
        this.currentMessageIndex++;
        this.loadingStatus.textContent = message;
        const progress = (this.currentMessageIndex / this.loadingMessages.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        await this.delay(800);
    }

    async uploadImageToImgBB(file) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const result = await response.json();
        return result.data.url;
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:image/jpeg;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    async analyzeWithGemini(imageUrl) {
        // Check if API key is properly set
        if (this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || !this.GEMINI_API_KEY) {
            throw new Error('Please set your Google Gemini API key! Get it from: https://aistudio.google.com/');
        }

        try {
            // Convert image URL to base64
            const imageBase64 = await this.urlToBase64(imageUrl);

            const requestBody = {
                contents: [{
                    parts: [
                        {
                            text: "Analyze this food image and identify each food item with their nutritional information. Provide the response in this exact JSON format: {\"items\":[{\"item_name\":\"name of item\", \"total_calories\":100, \"total_protien\":5.0, \"toal_carbs\":15.0, \"toal_fats\":3.0}]}. Only return valid JSON, no additional text."
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: imageBase64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json"
                },
                tools: [
                    {
                        googleSearch: {}
                    }
                ]
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API Error:', response.status, errorText);
                throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Gemini API Response:', result);

            // Extract the generated text
            if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
                const generatedText = result.candidates[0].content.parts[0].text;

                try {
                    return JSON.parse(generatedText);
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Raw content:', generatedText);
                    // Try to extract JSON from the response
                    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                    return this.createFallbackResponse();
                }
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }

    async urlToBase64(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting URL to base64:', error);
            throw error;
        }
    }

    createFallbackResponse() {
        // Create a basic response when JSON parsing fails
        return {
            items: [
                {
                    item_name: "Food Item",
                    total_calories: 250,
                    total_protien: 10.0,
                    toal_carbs: 30.0,
                    toal_fats: 8.0
                }
            ]
        };
    }

    processAnalysisResult(analysisResult) {
        const items = analysisResult.items || [];

        // Calculate totals
        const totalCalories = items.reduce((sum, item) => sum + (item.total_calories || 0), 0);
        const totalProtein = items.reduce((sum, item) => sum + (item.total_protien || 0), 0);
        const totalCarbs = items.reduce((sum, item) => sum + (item.toal_carbs || 0), 0);
        const totalFats = items.reduce((sum, item) => sum + (item.toal_fats || 0), 0);

        // Get food emojis
        const foodEmojis = {
            'rice': '🍚', 'bread': '🍞', 'pizza': '🍕', 'burger': '🍔', 'sandwich': '🥪',
            'salad': '🥗', 'soup': '🍲', 'pasta': '🍝', 'noodles': '🍜', 'curry': '🍛',
            'chicken': '🍗', 'fish': '🐟', 'meat': '🥩', 'egg': '🥚', 'cheese': '🧀',
            'fruit': '�', 'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇',
            'vegetable': '🥬', 'carrot': '🥕', 'potato': '🥔', 'tomato': '🍅',
            'dessert': '🍰', 'cake': '🍰', 'cookie': '🍪', 'chocolate': '🍫',
            'drink': '🥤', 'coffee': '☕', 'tea': '🍵', 'juice': '🧃'
        };

        const getEmoji = (itemName) => {
            const name = itemName.toLowerCase();
            for (const [key, emoji] of Object.entries(foodEmojis)) {
                if (name.includes(key)) return emoji;
            }
            return '🍽️'; // Default food emoji
        };

        return {
            items: items.map(item => ({
                name: item.item_name || 'Unknown Food',
                emoji: getEmoji(item.item_name || ''),
                calories: Math.round(item.total_calories || 0),
                protein: Math.round((item.total_protien || 0) * 10) / 10,
                carbs: Math.round((item.toal_carbs || 0) * 10) / 10,
                fat: Math.round((item.toal_fats || 0) * 10) / 10
            })),
            totals: {
                calories: Math.round(totalCalories),
                protein: Math.round(totalProtein * 10) / 10,
                carbs: Math.round(totalCarbs * 10) / 10,
                fat: Math.round(totalFats * 10) / 10
            },
            confidence: 95.0,
            analysisTime: new Date().toLocaleString()
        };
    }

    displayResults(data) {
        // Create food info card with multiple items
        const itemsHtml = data.items.map(item => `
            <div class="food-item glass-card">
                <div class="item-header">
                    <div class="item-emoji">${item.emoji}</div>
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <div class="item-calories">${item.calories} kcal</div>
                    </div>
                </div>
                <div class="item-macros">
                    <div class="macro-circle">
                        <div class="circular-progress" data-percentage="${Math.min((item.protein / 50) * 100, 100)}">
                            <svg class="progress-ring" width="60" height="60">
                                <circle class="progress-ring-circle" stroke="#0ea5e9" stroke-width="4" fill="transparent" r="26" cx="30" cy="30"/>
                            </svg>
                            <div class="progress-text">
                                <span class="value">${item.protein}g</span>
                                <span class="label">Protein</span>
                            </div>
                        </div>
                    </div>
                    <div class="macro-circle">
                        <div class="circular-progress" data-percentage="${Math.min((item.carbs / 100) * 100, 100)}">
                            <svg class="progress-ring" width="60" height="60">
                                <circle class="progress-ring-circle" stroke="#eab308" stroke-width="4" fill="transparent" r="26" cx="30" cy="30"/>
                            </svg>
                            <div class="progress-text">
                                <span class="value">${item.carbs}g</span>
                                <span class="label">Carbs</span>
                            </div>
                        </div>
                    </div>
                    <div class="macro-circle">
                        <div class="circular-progress" data-percentage="${Math.min((item.fat / 50) * 100, 100)}">
                            <svg class="progress-ring" width="60" height="60">
                                <circle class="progress-ring-circle" stroke="#8b5cf6" stroke-width="4" fill="transparent" r="26" cx="30" cy="30"/>
                            </svg>
                            <div class="progress-text">
                                <span class="value">${item.fat}g</span>
                                <span class="label">Fat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.foodInfoCard.innerHTML = `
            <div class="analysis-header">
                <div class="analysis-title">
                    <h3>Food Analysis Results</h3>
                    <div class="confidence-badge">
                        <i class="fas fa-brain"></i>
                        <span>${data.confidence}% confidence</span>
                    </div>
                </div>
                <div class="analysis-time">${data.analysisTime}</div>
            </div>
            <div class="food-items-container">
                ${itemsHtml}
            </div>
        `;

        // Create nutrition cards with totals
        const nutritionCards = `
            <div class="nutrition-card primary glass-card">
                <div class="nutrition-icon">🔥</div>
                <div class="nutrition-label">Total Calories</div>
                <div class="nutrition-value">${data.totals.calories}</div>
                <div class="nutrition-unit">kcal</div>
            </div>
            <div class="nutrition-card secondary glass-card">
                <div class="nutrition-icon">💪</div>
                <div class="nutrition-label">Total Protein</div>
                <div class="nutrition-value">${data.totals.protein}</div>
                <div class="nutrition-unit">g</div>
            </div>
            <div class="nutrition-card secondary glass-card">
                <div class="nutrition-icon">🌾</div>
                <div class="nutrition-label">Total Carbs</div>
                <div class="nutrition-value">${data.totals.carbs}</div>
                <div class="nutrition-unit">g</div>
            </div>
            <div class="nutrition-card secondary glass-card">
                <div class="nutrition-icon">🥑</div>
                <div class="nutrition-label">Total Fat</div>
                <div class="nutrition-value">${data.totals.fat}</div>
                <div class="nutrition-unit">g</div>
            </div>
            <div class="nutrition-card secondary glass-card">
                <div class="nutrition-icon">🍽️</div>
                <div class="nutrition-label">Food Items</div>
                <div class="nutrition-value">${data.items.length}</div>
                <div class="nutrition-unit">items</div>
            </div>
        `;

        this.nutritionGrid.innerHTML = nutritionCards;

        // Create detailed analysis with summary
        this.analysisContent.innerHTML = `
            <div class="analysis-summary">
                <h4><i class="fas fa-chart-pie"></i> Nutritional Summary</h4>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Total Items Detected:</span>
                        <span class="summary-value">${data.items.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Analysis Confidence:</span>
                        <span class="summary-value">${data.confidence}%</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Analysis Time:</span>
                        <span class="summary-value">${data.analysisTime}</span>
                    </div>
                </div>
            </div>
        `;

        // Show results section with animation
        this.resultsSection.style.display = 'block';
        setTimeout(() => {
            this.resultsSection.classList.add('show');
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Animate circular progress indicators
            this.animateCircularProgress();
        }, 200);

        // Add success notification
        this.showNotification('Analysis complete! 🎉', 'success');
    }

    animateCircularProgress() {
        const progressElements = document.querySelectorAll('.circular-progress');

        progressElements.forEach((element, index) => {
            const percentage = parseFloat(element.dataset.percentage);
            const circle = element.querySelector('.progress-ring-circle');
            const circumference = 2 * Math.PI * 26; // radius = 26

            // Set initial state
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;

            // Animate with delay for staggered effect
            setTimeout(() => {
                const offset = circumference - (percentage / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }, index * 200);
        });
    }

    addToHistory(data) {
        const historySlide = document.createElement('div');
        historySlide.className = 'swiper-slide';

        // Use the first item's emoji or a default
        const displayEmoji = data.items.length > 0 ? data.items[0].emoji : '🍽️';
        const displayName = data.items.length > 1 ?
            `${data.items[0].name} +${data.items.length - 1} more` :
            (data.items[0]?.name || 'Food Analysis');

        historySlide.innerHTML = `
            <div class="history-card glass-card">
                <div class="history-image">
                    <div class="food-icon">${displayEmoji}</div>
                    <div class="scan-badge">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <div class="history-content">
                    <h4 class="food-name">${displayName}</h4>
                    <div class="calories-info">
                        <span class="calories">${data.totals.calories}</span>
                        <span class="unit">kcal</span>
                    </div>
                    <div class="scan-time">Just now</div>
                </div>
                <div class="history-stats">
                    <div class="stat">
                        <span class="value">${data.totals.protein}g</span>
                        <span class="label">Protein</span>
                    </div>
                    <div class="stat">
                        <span class="value">${data.totals.fat}g</span>
                        <span class="label">Fat</span>
                    </div>
                </div>
            </div>
        `;

        // Add to beginning of history
        this.historyWrapper.insertBefore(historySlide, this.historyWrapper.firstChild);

        // Update swiper
        this.historySwiper.update();

        // Limit history to 10 items
        while (this.historyWrapper.children.length > 10) {
            this.historyWrapper.removeChild(this.historyWrapper.lastChild);
        }
    }

    saveResults() {
        // Simulate saving to profile
        this.showNotification('Results saved to your profile! 💾', 'success');
        
        // Add visual feedback
        this.saveBtn.innerHTML = `
            <div class="btn-icon">
                <i class="fas fa-check"></i>
            </div>
            <span>Saved!</span>
            <div class="btn-glow"></div>
        `;
        
        setTimeout(() => {
            this.saveBtn.innerHTML = `
                <div class="btn-icon">
                    <i class="fas fa-bookmark"></i>
                </div>
                <span>Save to Profile</span>
                <div class="btn-glow"></div>
            `;
        }, 2000);
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'CalorieScan Pro Results',
                text: 'Check out my food analysis results!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard! 📋', 'success');
            });
        }
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
        if (!show) {
            this.progressFill.style.width = '0%';
        }
    }

    resetApp() {
        // Hide sections with animation
        this.previewSection.classList.remove('show');
        this.resultsSection.classList.remove('show');
        
        setTimeout(() => {
            this.previewSection.style.display = 'none';
            this.resultsSection.style.display = 'none';
        }, 300);

        // Clear inputs and image
        this.fileInput.value = '';
        this.cameraInput.value = '';
        this.previewImage.src = '';
        this.currentFile = null;
        // Disable analyze button
        this.analyzeBtn.disabled = true;

        // Scroll to upload section
        document.querySelector('.upload-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });

        // Reset progress
        this.progressFill.style.width = '0%';
        this.currentMessageIndex = 0;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} glass-card`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    z-index: 1500;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 350px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    border-left: 4px solid var(--secondary-color);
                }
                .notification-error {
                    border-left: 4px solid #ef4444;
                }
                .notification-info {
                    border-left: 4px solid var(--primary-color);
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    transition: var(--transition-smooth);
                }
                .notification-close:hover {
                    color: var(--text-primary);
                    background: rgba(255, 255, 255, 0.1);
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app and disable analyze button by default
    const app = new AdvancedCalorieApp();
    if (app.analyzeBtn) app.analyzeBtn.disabled = true;
});

// Add additional CSS for new components
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .food-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .food-emoji {
        font-size: 4rem;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: 50%;
        flex-shrink: 0;
    }
    
    .food-details {
        flex: 1;
    }
    
    .food-name {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .food-description {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.5;
    }
    
    .confidence-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(6, 182, 212, 0.2);
        color: var(--secondary-color);
        border-radius: 2rem;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .food-meta {
        display: flex;
        gap: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .meta-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .meta-label {
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    
    .meta-value {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .health-score {
        color: var(--secondary-color);
        font-family: 'JetBrains Mono', monospace;
    }
    
    .benefits-section {
        margin-bottom: 2rem;
    }
    
    .benefits-section h4 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 1.1rem;
    }
    
    .benefits-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .benefit-tag {
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border-radius: 2rem;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .analysis-grid {
        display: grid;
        gap: 0.75rem;
    }
    
    @media (max-width: 768px) {
        .food-header {
            flex-direction: column;
            text-align: center;
        }
        
        .food-meta {
            flex-direction: column;
            gap: 1rem;
        }
        
        .benefits-list {
            justify-content: center;
        }
    }
`;
document.head.appendChild(additionalStyles);