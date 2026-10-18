// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.querySelector('.navbar');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const backToTopBtn = document.getElementById('back-to-top');

// Loading Screen Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 2000);
});

// Navbar Scroll Effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Navbar background on scroll
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(248, 253, 248, 0.98)';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(26, 47, 26, 0.98)';
        }
    } else {
        navbar.style.background = 'rgba(248, 253, 248, 0.95)';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(26, 47, 26, 0.95)';
        }
    }
    
    // Back to top button
    if (currentScrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    lastScrollY = currentScrollY;
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Update navbar background
    setTimeout(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
            navbar.style.background = newTheme === 'dark' 
                ? 'rgba(26, 47, 26, 0.98)' 
                : 'rgba(248, 253, 248, 0.98)';
        } else {
            navbar.style.background = newTheme === 'dark' 
                ? 'rgba(26, 47, 26, 0.95)' 
                : 'rgba(248, 253, 248, 0.95)';
        }
    }, 100);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') {
    themeToggle.querySelector('i').className = 'fas fa-sun';
}

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                max-width: 400px;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(450px);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid var(--accent-primary);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-primary);
            }
            
            .notification-content i {
                color: var(--accent-primary);
            }
            
            .notification-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Animated counters for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger counter animation for stats
            if (entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .specialty-card, .testimonial-card, .blog-card, .step-item, .hero-stats').forEach(el => {
    observer.observe(el);
});

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .service-card,
    .specialty-card,
    .testimonial-card,
    .blog-card,
    .step-item,
    .hero-stats {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .hero-stats .stat-item {
        transition-delay: calc(var(--index, 0) * 0.1s);
    }
`;
document.head.appendChild(animationStyles);

// Add mobile menu styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            box-shadow: var(--shadow-lg);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateX(0);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-link.active {
            color: var(--accent-primary);
        }
        
        body.nav-open {
            overflow: hidden;
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Enhanced scroll effects
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for floating leaves
    document.querySelectorAll('.floating-leaf').forEach((leaf, index) => {
        const speed = 0.2 + (index * 0.1);
        leaf.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});


// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (navMenu.classList.contains('active')) {
            hamburger.click();
        }
    }
});

// Print styles
const printStyles = document.createElement('style');
printStyles.media = 'print';
printStyles.textContent = `
    @media print {
        .navbar,
        .back-to-top,
        .loading-screen,
        .bg-elements {
            display: none !important;
        }
        
        body {
            background: white !important;
        }
        
        .hero {
            padding-top: 2rem !important;
        }
        
        .btn {
            border: 2px solid var(--accent-primary) !important;
            background: transparent !important;
        }
    }
`;
document.head.appendChild(printStyles);

// Blog content data
const blogContent = {
    'gut-health': {
        title: 'The Ultimate Guide to Healing Your Gut Naturally',
        category: 'Gut Health',
        date: 'January 15, 2025',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
        content: `
            <p>Your gut health is the foundation of your overall wellbeing. The digestive system, often called our "second brain," houses trillions of microorganisms that influence everything from our mood to our immune system. In this comprehensive guide, I'll share evidence-based strategies to naturally heal and optimize your gut health.</p>

            <h2>Understanding Your Gut Microbiome</h2>
            <p>The gut microbiome is a complex ecosystem of bacteria, viruses, fungi, and other microorganisms living in your digestive tract. When this ecosystem is balanced, you experience better digestion, stronger immunity, improved mood, and enhanced overall health.</p>

            <div class="highlight-box">
                <h4><i class="fas fa-lightbulb"></i> Did You Know?</h4>
                <p>Your gut contains over 100 trillion microorganisms - that's 10 times more than the number of human cells in your body! These tiny inhabitants play crucial roles in digestion, vitamin production, and immune function.</p>
            </div>

            <h2>Signs of an Unhealthy Gut</h2>
            <p>Before we dive into healing strategies, it's important to recognize the signs that your gut may need attention:</p>
            <ul>
                <li>Frequent digestive upset (bloating, gas, diarrhea, or constipation)</li>
                <li>Food intolerances or sensitivities</li>
                <li>Frequent infections or slow wound healing</li>
                <li>Chronic fatigue or low energy</li>
                <li>Mood changes, anxiety, or depression</li>
                <li>Skin issues like eczema or acne</li>
                <li>Unintentional weight changes</li>
                <li>Sleep disturbances</li>
            </ul>

            <h2>The 5 Pillars of Gut Healing</h2>

            <h3>1. Remove Inflammatory Foods</h3>
            <p>The first step in gut healing is identifying and removing foods that cause inflammation or damage to your intestinal lining. Common culprits include:</p>
            <ul>
                <li>Processed foods high in sugar and artificial additives</li>
                <li>Refined grains and excessive gluten</li>
                <li>Industrial seed oils (canola, soybean, corn oil)</li>
                <li>Excessive alcohol</li>
                <li>Foods you're personally sensitive to</li>
            </ul>

            <h3>2. Replace with Healing Foods</h3>
            <p>Focus on nutrient-dense, whole foods that support gut repair:</p>
            <ul>
                <li><strong>Bone broth:</strong> Rich in collagen and minerals that heal the intestinal lining</li>
                <li><strong>Fermented foods:</strong> Kimchi, sauerkraut, kefir, and yogurt provide beneficial bacteria</li>
                <li><strong>Prebiotic foods:</strong> Garlic, onions, asparagus, and Jerusalem artichokes feed good bacteria</li>
                <li><strong>Anti-inflammatory fats:</strong> Olive oil, avocados, fatty fish, and nuts</li>
                <li><strong>Fiber-rich vegetables:</strong> Leafy greens, broccoli, and colorful vegetables</li>
            </ul>

            <h3>3. Repair the Gut Lining</h3>
            <p>Specific nutrients can help repair damage to your intestinal wall:</p>
            <ul>
                <li><strong>L-Glutamine:</strong> An amino acid that serves as fuel for intestinal cells</li>
                <li><strong>Zinc:</strong> Essential for tissue repair and immune function</li>
                <li><strong>Omega-3 fatty acids:</strong> Reduce inflammation and support gut barrier function</li>
                <li><strong>Vitamin D:</strong> Supports immune function and gut barrier integrity</li>
            </ul>

            <h3>4. Reinoculate with Probiotics</h3>
            <p>Introduce beneficial bacteria through:</p>
            <ul>
                <li>High-quality probiotic supplements (containing 10+ billion CFUs)</li>
                <li>Fermented foods daily</li>
                <li>Prebiotic foods to feed the good bacteria</li>
            </ul>

            <h3>5. Rebalance Your Lifestyle</h3>
            <p>Your lifestyle significantly impacts gut health:</p>
            <ul>
                <li><strong>Stress management:</strong> Chronic stress disrupts gut bacteria and increases inflammation</li>
                <li><strong>Quality sleep:</strong> Aim for 7-9 hours nightly to support gut repair</li>
                <li><strong>Regular exercise:</strong> Moderate activity promotes beneficial bacteria diversity</li>
                <li><strong>Mindful eating:</strong> Eat slowly, chew thoroughly, and avoid eating when stressed</li>
            </ul>

            <blockquote>
                "Healing your gut isn't just about what you eat - it's about creating a lifestyle that supports your body's natural ability to repair and thrive."
            </blockquote>

            <h2>A Sample Gut-Healing Day</h2>
            <p>Here's what a gut-friendly day might look like:</p>

            <div class="highlight-box">
                <h4><i class="fas fa-sun"></i> Morning Routine</h4>
                <ul>
                    <li>Start with warm lemon water to stimulate digestion</li>
                    <li>Breakfast: Greek yogurt with berries and ground flaxseed</li>
                    <li>Take probiotics on an empty stomach</li>
                </ul>
            </div>

            <div class="highlight-box">
                <h4><i class="fas fa-clock"></i> Midday</h4>
                <ul>
                    <li>Lunch: Large salad with fermented vegetables and grilled salmon</li>
                    <li>Stay hydrated with herbal teas or filtered water</li>
                    <li>Practice deep breathing or short meditation</li>
                </ul>
            </div>

            <div class="highlight-box">
                <h4><i class="fas fa-moon"></i> Evening</h4>
                <ul>
                    <li>Dinner: Bone broth soup with vegetables and lean protein</li>
                    <li>Wind down with chamomile tea</li>
                    <li>Aim for bed by 10 PM for optimal gut repair</li>
                </ul>
            </div>

            <h2>When to Seek Professional Help</h2>
            <p>While these natural strategies are powerful, some situations require professional guidance:</p>
            <ul>
                <li>Persistent symptoms despite dietary changes</li>
                <li>Severe digestive pain or bleeding</li>
                <li>Suspected SIBO, candida overgrowth, or parasites</li>
                <li>Need for comprehensive testing (food sensitivities, microbiome analysis)</li>
            </ul>

            <p>Remember, gut healing is a journey, not a destination. Be patient with yourself and focus on progress, not perfection. Small, consistent changes compound over time to create lasting transformation in your digestive health and overall wellbeing.</p>
        `
    },
    'meal-prep': {
        title: 'Meal Prep Mastery: 5 Strategies for Busy Professionals',
        category: 'Meal Planning',
        date: 'January 10, 2025',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=400&fit=crop',
        content: `
            <p>As a busy professional, you know the struggle: long work days, deadlines, meetings, and somehow finding time to eat well. Meal prep isn't just a trend - it's a game-changing strategy that can save you time, money, and help you maintain consistent nutrition even during your busiest weeks.</p>

            <h2>Why Meal Prep Works for Professionals</h2>
            <p>Meal preparation addresses the three biggest barriers to healthy eating for busy professionals:</p>
            <ul>
                <li><strong>Time constraints:</strong> Cook once, eat multiple times</li>
                <li><strong>Decision fatigue:</strong> Pre-planned meals eliminate daily food decisions</li>
                <li><strong>Impulse eating:</strong> Having healthy meals ready prevents poor food choices</li>
            </ul>

            <div class="highlight-box">
                <h4><i class="fas fa-chart-line"></i> The Professional's Advantage</h4>
                <p>Professionals who meal prep report 40% better adherence to their nutrition goals and save an average of 4 hours per week on food-related decisions and preparation.</p>
            </div>

            <h2>Strategy 1: The Sunday Power Session</h2>
            <p>Dedicate 2-3 hours every Sunday to batch cooking. This concentrated effort sets you up for success all week:</p>

            <h3>The 90-Minute Sunday Routine:</h3>
            <ol>
                <li><strong>Minutes 1-15:</strong> Plan your week and create shopping list</li>
                <li><strong>Minutes 16-30:</strong> Prep vegetables (wash, chop, portion)</li>
                <li><strong>Minutes 31-60:</strong> Cook proteins (grill chicken, bake salmon, prepare legumes)</li>
                <li><strong>Minutes 61-75:</strong> Prepare grains and starches (rice, quinoa, sweet potatoes)</li>
                <li><strong>Minutes 76-90:</strong> Assemble meals and clean up</li>
            </ol>

            <blockquote>
                "The most successful professionals treat meal prep like they treat important meetings - they schedule it, prioritize it, and show up consistently."
            </blockquote>

            <h2>Strategy 2: The Mix-and-Match Formula</h2>
            <p>Instead of preparing complete meals, prep components that can be mixed and matched throughout the week. This prevents food boredom and provides flexibility:</p>

            <div class="highlight-box">
                <h4><i class="fas fa-utensils"></i> The Perfect Plate Formula</h4>
                <p><strong>Protein + Vegetables + Healthy Carbs + Healthy Fats = Balanced Meal</strong></p>
                <ul>
                    <li><strong>Proteins:</strong> Grilled chicken, baked fish, hard-boiled eggs, legumes</li>
                    <li><strong>Vegetables:</strong> Roasted vegetables, fresh salads, steamed broccoli</li>
                    <li><strong>Healthy Carbs:</strong> Quinoa, brown rice, sweet potatoes, whole grains</li>
                    <li><strong>Healthy Fats:</strong> Avocado, nuts, seeds, olive oil</li>
                </ul>
            </div>

            <h3>Sample Week of Mix-and-Match Meals:</h3>
            <ul>
                <li><strong>Monday:</strong> Grilled chicken + roasted vegetables + quinoa + avocado</li>
                <li><strong>Tuesday:</strong> Baked salmon + fresh salad + sweet potato + nuts</li>
                <li><strong>Wednesday:</strong> Hard-boiled eggs + steamed broccoli + brown rice + olive oil</li>
                <li><strong>Thursday:</strong> Legumes + roasted vegetables + quinoa + seeds</li>
                <li><strong>Friday:</strong> Grilled chicken + fresh salad + sweet potato + avocado</li>
            </ul>

            <h2>Strategy 3: Strategic Container System</h2>
            <p>Invest in a good container system that supports your meal prep goals:</p>

            <h3>Container Types You Need:</h3>
            <ul>
                <li><strong>Glass containers with tight lids:</strong> For main meals (3-4 large containers)</li>
                <li><strong>Small portion containers:</strong> For snacks, dressings, and nuts</li>
                <li><strong>Mason jars:</strong> Perfect for salads, overnight oats, and smoothie ingredients</li>
                <li><strong>Freezer bags:</strong> For batch-cooked proteins and pre-portioned freezer meals</li>
            </ul>

            <div class="highlight-box">
                <h4><i class="fas fa-snowflake"></i> Freezer-Friendly Pro Tip</h4>
                <p>Prepare double portions and freeze half. This creates a "meal bank" for especially busy weeks or unexpected schedule changes.</p>
            </div>

            <h2>Strategy 4: The 20-Minute Weeknight Refresh</h2>
            <p>Not everything needs to be done on Sunday. Use 20 minutes on Wednesday evening to refresh your supplies:</p>
            <ul>
                <li>Wash and prep vegetables for the rest of the week</li>
                <li>Prepare fresh salads for Thursday and Friday</li>
                <li>Cook quick proteins like eggs or canned fish</li>
                <li>Refill snack containers</li>
            </ul>

            <h2>Strategy 5: Professional-Friendly Meal Ideas</h2>
            <p>Choose meals that travel well, can be eaten at room temperature, and don't require reheating:</p>

            <h3>Desk-Friendly Lunches:</h3>
            <ul>
                <li><strong>Mason Jar Salads:</strong> Dressing at bottom, hearty vegetables, proteins, greens on top</li>
                <li><strong>Grain Bowls:</strong> Quinoa or brown rice with roasted vegetables and protein</li>
                <li><strong>Wrap or Sandwich:</strong> Whole grain with lean protein and vegetables</li>
                <li><strong>Bento-Style Boxes:</strong> Variety of small portions including protein, vegetables, fruits, nuts</li>
            </ul>

            <h3>Meeting-Day Snacks:</h3>
            <ul>
                <li>Pre-portioned nuts and seeds</li>
                <li>Cut vegetables with hummus</li>
                <li>Greek yogurt with berries</li>
                <li>Hard-boiled eggs</li>
                <li>Homemade energy balls</li>
            </ul>

            <h2>Overcoming Common Meal Prep Obstacles</h2>

            <h3>"I Don't Have Time"</h3>
            <p><strong>Solution:</strong> Start small. Even 30 minutes of prep can make a difference. Prepare just breakfasts or just snacks to begin.</p>

            <h3>"I Get Bored Eating the Same Thing"</h3>
            <p><strong>Solution:</strong> Use the mix-and-match strategy and vary your seasonings and sauces throughout the week.</p>

            <h3>"My Schedule Changes Too Much"</h3>
            <p><strong>Solution:</strong> Focus on portable, flexible options and maintain a well-stocked emergency kit at your office.</p>

            <h3>"I Travel for Work"</h3>
            <p><strong>Solution:</strong> Pack travel-friendly snacks and research healthy restaurant options in advance. Use hotel mini-fridges when available.</p>

            <div class="highlight-box">
                <h4><i class="fas fa-briefcase"></i> The Executive Emergency Kit</h4>
                <p>Keep these non-perishables at your office:</p>
                <ul>
                    <li>Individual nut butter packets</li>
                    <li>Whole grain crackers</li>
                    <li>Canned fish or chicken</li>
                    <li>Instant oatmeal packets</li>
                    <li>Protein powder</li>
                    <li>Herbal tea bags</li>
                </ul>
            </div>

            <h2>Meal Prep Success Metrics</h2>
            <p>Track your success with these professional-friendly metrics:</p>
            <ul>
                <li><strong>Time saved:</strong> Track minutes saved on daily food decisions</li>
                <li><strong>Money saved:</strong> Compare meal prep costs to eating out</li>
                <li><strong>Energy levels:</strong> Notice improvements in afternoon energy</li>
                <li><strong>Stress reduction:</strong> Rate your mealtime stress on a 1-10 scale</li>
            </ul>

            <p>Remember, meal prep is a skill that improves with practice. Start with one or two strategies, master them, then gradually add more techniques. Your future self will thank you for the investment in systems that support your health and professional success.</p>
        `
    },
    'anti-inflammatory': {
        title: '10 Powerful Anti-Inflammatory Foods to Add to Your Diet',
        category: 'Anti-Inflammatory',
        date: 'January 5, 2025',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        content: `
            <p>Chronic inflammation is at the root of many modern health issues, from arthritis and heart disease to diabetes and depression. The good news? Your diet can be one of your most powerful tools in fighting inflammation naturally. Let's explore ten scientifically-backed anti-inflammatory foods that you can easily incorporate into your daily meals.</p>

            <h2>Understanding Inflammation</h2>
            <p>Not all inflammation is bad. Acute inflammation is your body's natural response to injury or infection - it's protective and healing. However, chronic low-grade inflammation can persist for months or years, damaging healthy tissues and contributing to disease.</p>

            <div class="highlight-box">
                <h4><i class="fas fa-heartbeat"></i> Signs of Chronic Inflammation</h4>
                <ul>
                    <li>Joint pain and stiffness</li>
                    <li>Persistent fatigue</li>
                    <li>Digestive issues</li>
                    <li>Frequent infections</li>
                    <li>Skin problems</li>
                    <li>Brain fog</li>
                </ul>
            </div>

            <h2>The Top 10 Anti-Inflammatory Powerhouses</h2>

            <h3>1. Fatty Fish (Salmon, Mackerel, Sardines)</h3>
            <p>Rich in omega-3 fatty acids EPA and DHA, fatty fish are among the most potent anti-inflammatory foods available.</p>
            <ul>
                <li><strong>Key compounds:</strong> EPA, DHA omega-3s</li>
                <li><strong>Recommended intake:</strong> 2-3 servings per week</li>
                <li><strong>Tip:</strong> Choose wild-caught when possible for higher omega-3 content</li>
            </ul>

            <h3>2. Leafy Greens (Spinach, Kale, Swiss Chard)</h3>
            <p>Packed with antioxidants, vitamins, and minerals that combat oxidative stress and inflammation.</p>
            <ul>
                <li><strong>Key compounds:</strong> Vitamin K, folate, antioxidants</li>
                <li><strong>Recommended intake:</strong> 2-3 cups daily</li>
                <li><strong>Tip:</strong> Lightly sauté with garlic and olive oil to enhance nutrient absorption</li>
            </ul>

            <h3>3. Berries (Blueberries, Strawberries, Cherries)</h3>
            <p>Anthocyanins give berries their vibrant colors and provide powerful anti-inflammatory effects.</p>
            <ul>
                <li><strong>Key compounds:</strong> Anthocyanins, vitamin C, fiber</li>
                <li><strong>Recommended intake:</strong> 1 cup daily</li>
                <li><strong>Tip:</strong> Frozen berries are just as nutritious as fresh and often more affordable</li>
            </ul>

            <h3>4. Turmeric</h3>
            <p>This golden spice contains curcumin, one of the most studied anti-inflammatory compounds in nature.</p>
            <ul>
                <li><strong>Key compounds:</strong> Curcumin</li>
                <li><strong>Recommended intake:</strong> 1-2 teaspoons daily</li>
                <li><strong>Tip:</strong> Combine with black pepper and healthy fats to enhance absorption</li>
            </ul>

            <blockquote>
                "The compounds in turmeric are so powerful that they've been shown to be as effective as some anti-inflammatory medications, but without the side effects."
            </blockquote>

            <h3>5. Extra Virgin Olive Oil</h3>
            <p>Rich in oleic acid and oleocanthal, compounds that have been shown to reduce inflammatory markers.</p>
            <ul>
                <li><strong>Key compounds:</strong> Oleocanthal, oleic acid, vitamin E</li>
                <li><strong>Recommended intake:</strong> 2-3 tablespoons daily</li>
                <li><strong>Tip:</strong> Use cold-pressed, extra virgin olive oil and avoid heating to high temperatures</li>
            </ul>

            <h3>6. Nuts and Seeds (Walnuts, Flaxseeds, Chia Seeds)</h3>
            <p>Excellent sources of healthy fats, protein, and anti-inflammatory compounds.</p>
            <ul>
                <li><strong>Key compounds:</strong> Alpha-linolenic acid (ALA), vitamin E, magnesium</li>
                <li><strong>Recommended intake:</strong> 1 ounce (small handful) daily</li>
                <li><strong>Tip:</strong> Store in the refrigerator to prevent rancidity and nutrient loss</li>
            </ul>

            <h3>7. Ginger</h3>
            <p>Contains gingerols and shogaols, potent anti-inflammatory and antioxidant compounds.</p>
            <ul>
                <li><strong>Key compounds:</strong> Gingerols, shogaols</li>
                <li><strong>Recommended intake:</strong> 1-3 grams daily</li>
                <li><strong>Tip:</strong> Fresh ginger is more potent than dried; add to smoothies, teas, or stir-fries</li>
            </ul>

            <h3>8. Green Tea</h3>
            <p>Rich in polyphenols, particularly EGCG, which has strong anti-inflammatory properties.</p>
            <ul>
                <li><strong>Key compounds:</strong> EGCG, catechins</li>
                <li><strong>Recommended intake:</strong> 2-3 cups daily</li>
                <li><strong>Tip:</strong> Steep for 3-5 minutes in water just below boiling for maximum benefit</li>
            </ul>

            <h3>9. Avocados</h3>
            <p>Loaded with monounsaturated fats, fiber, and potassium that help reduce inflammation.</p>
            <ul>
                <li><strong>Key compounds:</strong> Oleic acid, potassium, carotenoids</li>
                <li><strong>Recommended intake:</strong> 1/2 to 1 avocado daily</li>
                <li><strong>Tip:</strong> The fat in avocados helps your body absorb fat-soluble vitamins from other foods</li>
            </ul>

            <h3>10. Cruciferous Vegetables (Broccoli, Brussels Sprouts, Cauliflower)</h3>
            <p>Contain sulforaphane and other compounds that help reduce inflammatory markers.</p>
            <ul>
                <li><strong>Key compounds:</strong> Sulforaphane, vitamin C, fiber</li>
                <li><strong>Recommended intake:</strong> 1-2 cups daily</li>
                <li><strong>Tip:</strong> Lightly steam or eat raw to preserve the most nutrients</li>
            </ul>

            <h2>Creating Anti-Inflammatory Meals</h2>
            <p>The key to an anti-inflammatory diet is not just individual foods, but how you combine them:</p>

            <div class="highlight-box">
                <h4><i class="fas fa-utensils"></i> Sample Anti-Inflammatory Day</h4>
                <p><strong>Breakfast:</strong> Green smoothie with spinach, berries, chia seeds, and ginger</p>
                <p><strong>Lunch:</strong> Kale salad with walnuts, avocado, and olive oil dressing</p>
                <p><strong>Dinner:</strong> Baked salmon with turmeric-roasted cauliflower</p>
                <p><strong>Snack:</strong> Green tea with a small handful of nuts</p>
            </div>

            <h2>Foods to Limit or Avoid</h2>
            <p>While adding anti-inflammatory foods, also reduce these pro-inflammatory items:</p>
            <ul>
                <li>Processed and packaged foods</li>
                <li>Refined sugars and high fructose corn syrup</li>
                <li>Trans fats and excessive omega-6 oils</li>
                <li>Excessive alcohol</li>
                <li>Refined grains (white bread, white rice)</li>
                <li>Processed meats</li>
            </ul>

            <h2>Maximizing Anti-Inflammatory Benefits</h2>

            <h3>Preparation Tips:</h3>
            <ul>
                <li><strong>Eat the rainbow:</strong> Include colorful fruits and vegetables daily</li>
                <li><strong>Combine wisely:</strong> Pair turmeric with black pepper, tomatoes with olive oil</li>
                <li><strong>Don't overcook:</strong> Preserve nutrients with gentle cooking methods</li>
                <li><strong>Stay consistent:</strong> Anti-inflammatory benefits build over time</li>
            </ul>

            <h3>Lifestyle Factors That Enhance Anti-Inflammatory Effects:</h3>
            <ul>
                <li><strong>Regular exercise:</strong> Moderate activity reduces inflammation</li>
                <li><strong>Stress management:</strong> Chronic stress promotes inflammation</li>
                <li><strong>Quality sleep:</strong> Poor sleep increases inflammatory markers</li>
                <li><strong>Hydration:</strong> Adequate water intake supports detoxification</li>
            </ul>

            <div class="highlight-box">
                <h4><i class="fas fa-clock"></i> Timeline for Results</h4>
                <p>While some people notice improvements in energy and joint comfort within days, significant reductions in inflammatory markers typically occur after 4-6 weeks of consistent anti-inflammatory eating.</p>
            </div>

            <h2>Making It Practical</h2>
            <p>Start small and build gradually:</p>
            <ol>
                <li><strong>Week 1:</strong> Add berries to breakfast and include leafy greens in one meal daily</li>
                <li><strong>Week 2:</strong> Replace cooking oils with olive oil and add fatty fish twice weekly</li>
                <li><strong>Week 3:</strong> Include turmeric and ginger in cooking, drink green tea</li>
                <li><strong>Week 4:</strong> Add nuts/seeds as snacks and increase cruciferous vegetables</li>
            </ol>

            <p>Remember, an anti-inflammatory diet isn't about restriction - it's about abundance. Focus on adding these powerful foods rather than just removing others. Your body will thank you with reduced inflammation, increased energy, and better overall health.</p>
        `
    }
};

// Blog modal functionality
const blogModal = document.getElementById('blog-modal');
const blogModalOverlay = blogModal.querySelector('.blog-modal-overlay');
const blogModalClose = blogModal.querySelector('.blog-modal-close');
const blogLinks = document.querySelectorAll('.blog-link');

// Open blog modal
function openBlogModal(blogId) {
    const blog = blogContent[blogId];
    if (!blog) return;

    // Populate modal content
    blogModal.querySelector('.blog-modal-category').textContent = blog.category;
    blogModal.querySelector('.blog-modal-date').innerHTML = `<i class="fas fa-calendar"></i> ${blog.date}`;
    blogModal.querySelector('.blog-modal-read-time').innerHTML = `<i class="fas fa-clock"></i> ${blog.readTime}`;
    blogModal.querySelector('.blog-modal-title').textContent = blog.title;
    blogModal.querySelector('.blog-featured-image').src = blog.image;
    blogModal.querySelector('.blog-featured-image').alt = blog.title;
    blogModal.querySelector('.blog-modal-text').innerHTML = blog.content;

    // Show modal
    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Setup share buttons
    setupShareButtons(blog.title, window.location.href);
}

// Close blog modal
function closeBlogModal() {
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Setup share buttons
function setupShareButtons(title, url) {
    const shareButtons = blogModal.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.onclick = function() {
            const platform = this.className.includes('facebook') ? 'facebook' :
                           this.className.includes('twitter') ? 'twitter' :
                           this.className.includes('linkedin') ? 'linkedin' :
                           'copy';
            
            shareArticle(platform, title, url);
        };
    });
}

// Share article function
function shareArticle(platform, title, url) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Event listeners for blog modal
blogLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const blogId = link.getAttribute('data-blog');
        openBlogModal(blogId);
    });
});

blogModalClose.addEventListener('click', closeBlogModal);
blogModalOverlay.addEventListener('click', closeBlogModal);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal.classList.contains('active')) {
        closeBlogModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add index to stats for staggered animation
    document.querySelectorAll('.hero-stats .stat-item').forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
    
    console.log('🌿 Dr. Sarah Wellness website loaded successfully!');
});
