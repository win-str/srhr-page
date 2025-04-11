// DOM Elements
const scoreElement = document.getElementById('score');
const progressTextElement = document.getElementById('progressText');
const progressBarElement = document.getElementById('progressBar');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const infoContainerElement = document.getElementById('infoContainer');
const infoTextElement = document.getElementById('infoText');
const nextButtonElement = document.getElementById('nextBtn');
const celebrationElement = document.getElementById('celebration');
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.srhr-module, .game-container');
const badges = document.querySelectorAll('.badge');

// Game Variables
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answeredQuestions = 0;
let earnedBadges = {
  badge1: false, // Consent Champion
  badge2: false, // Contraception Expert
  badge3: false, // Health Advocate
  badge4: false  // Rights Defender
};

// Quiz Questions Database
const quizQuestions = [
  // Consent Questions
  {
    question: "What does the 'R' in the FRIES model of consent stand for?",
    options: ["Respectful", "Reversible", "Required", "Realistic"],
    correctAnswer: 1,
    info: "The FRIES model of consent stands for Freely given, Reversible, Informed, Enthusiastic, and Specific. Consent can be withdrawn at any time, which is what 'Reversible' represents.",
    category: "consent"
  },
  {
    question: "Which of the following is NOT an example of proper consent?",
    options: ["An enthusiastic verbal yes", "A clear non-verbal indication of agreement", "Silence or no response", "Ongoing check-ins during intimacy"],
    correctAnswer: 2,
    info: "Silence or no response is NOT consent. Consent must be clearly communicated, either verbally or through enthusiastic non-verbal cues, and should be ongoing.",
    category: "consent"
  },
  {
    question: "When is consent NOT possible?",
    options: ["When someone is sober and awake", "When someone is under the influence of alcohol or drugs", "When someone clearly says yes", "When someone initiates physical contact"],
    correctAnswer: 1,
    info: "Consent is not possible when someone is incapacitated by alcohol or drugs, asleep, or otherwise unable to make clear decisions. Being in an altered mental state affects someone's ability to give informed consent.",
    category: "consent"
  },
  
  // Contraception Questions
  {
    question: "Which contraceptive method provides protection against sexually transmitted infections (STIs)?",
    options: ["Hormonal IUD", "Implant", "Condoms", "Birth control pills"],
    correctAnswer: 2,
    info: "Condoms (both external/male and internal/female) are the only contraceptive methods that provide protection against most STIs in addition to preventing pregnancy.",
    category: "contraception"
  },
  {
    question: "What is dual protection in the context of contraception?",
    options: ["Taking two different birth control pills", "Using condoms plus another contraceptive method", "Using both male and female condoms simultaneously", "Using contraception during two consecutive days"],
    correctAnswer: 1,
    info: "Dual protection refers to using condoms along with another contraceptive method to provide both pregnancy prevention and STI protection, offering maximum safety.",
    category: "contraception"
  },
  {
    question: "Which statement about emergency contraception is TRUE?",
    options: ["It can only be used once per year", "It's the same as medical abortion", "It's effective up to 5 days after unprotected sex", "It provides ongoing protection for the rest of the month"],
    correctAnswer: 2,
    info: "Emergency contraception can be effective up to 5 days after unprotected sex, but effectiveness decreases over time. It's a one-time measure and does not provide ongoing protection.",
    category: "contraception"
  },
  
  // Sexual Health Questions
  {
    question: "How often should sexually active individuals get tested for STIs?",
    options: ["Only when symptoms appear", "Once in a lifetime", "Regularly, based on risk factors and number of partners", "Only after changing partners"],
    correctAnswer: 2,
    info: "Regular testing is recommended for sexually active individuals. The frequency depends on risk factors, number of partners, and types of sexual activity. Many STIs can be asymptomatic, so waiting for symptoms isn't effective.",
    category: "health"
  },
  {
    question: "Which of the following is NOT a component of sexual health?",
    options: ["Knowledge about one's body", "Prevention of STIs", "Mandatory abstinence", "Healthy relationship dynamics"],
    correctAnswer: 2,
    info: "Mandatory abstinence is not a component of sexual health. Sexual health encompasses a positive approach to sexuality and includes making informed personal choices, which may or may not include abstinence.",
    category: "health"
  },
  {
    question: "Which statement about STIs is FALSE?",
    options: ["Many STIs can be asymptomatic", "All STIs can be completely cured with antibiotics", "Some STIs can be prevented with vaccines", "Early detection leads to more effective treatment"],
    correctAnswer: 1,
    info: "Not all STIs can be cured with antibiotics. Viral STIs like HIV, herpes, and HPV can be managed but not completely cured. Bacterial STIs like chlamydia, gonorrhea, and syphilis can be treated with antibiotics.",
    category: "health"
  },
  
  // Reproductive Rights Questions
  {
    question: "What is reproductive justice?",
    options: ["Legal right to contraception", "The right to have children, not have children, and parent in safe environments", "Court cases about reproduction", "Medical care during pregnancy"],
    correctAnswer: 1,
    info: "Reproductive justice is a framework that goes beyond individual rights to address systemic inequalities. It includes the right to have children, not have children, parent children in safe environments, and have bodily autonomy free from reproductive oppression.",
    category: "rights"
  },
  {
    question: "Which international agreement prominently supported reproductive rights in 1994?",
    options: ["Universal Declaration of Human Rights", "International Conference on Population and Development (ICPD)", "Kyoto Protocol", "Geneva Convention"],
    correctAnswer: 1,
    info: "The International Conference on Population and Development (ICPD) in Cairo, 1994, was a landmark event that recognized reproductive rights as human rights and called for universal access to reproductive healthcare.",
    category: "rights"
  },
  {
    question: "Which is NOT considered a core reproductive right?",
    options: ["The right to bodily autonomy", "The right to make reproductive decisions free from discrimination", "The right to force others to follow your reproductive choices", "The right to access reproductive healthcare services"],
    correctAnswer: 2,
    info: "Forcing others to follow your reproductive choices is not a reproductive right. Reproductive rights are about individual autonomy and choice, not imposing beliefs or decisions on others.",
    category: "rights"
  }
];

// Initialize game
function initGame() {
  // Set up event listeners
  nextButtonElement.addEventListener('click', handleNextQuestion);
  tabs.forEach(tab => tab.addEventListener('click', handleTabChange));
  
  // Create confetti elements
  createConfetti();
  
  // Load first question
  loadQuestion(currentQuestion);
  updateScore();
  updateProgress();
  
  // Add hover effects to badges
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      if (!badge.classList.contains('earned')) {
        badge.style.transform = 'scale(1.05) rotate(5deg)';
        badge.style.transition = 'all 0.3s ease';
      }
    });
    
    badge.addEventListener('mouseleave', () => {
      if (!badge.classList.contains('earned')) {
        badge.style.transform = 'scale(1) rotate(0)';
      }
    });
  });
}

// Create confetti elements
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.width = Math.random() * 15 + 5 + 'px';
    confetti.style.height = Math.random() * 15 + 5 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    celebrationElement.appendChild(confetti);
  }
}

// Get random vibrant color for confetti
function getRandomColor() {
  const colors = [
    '#8a2be2', // Purple
    '#ff5757', // Pinkish Red
    '#4cd964', // Green
    '#ff9500', // Orange
    '#00a9ff', // Blue
    '#ff2d55', // Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Load a question
function loadQuestion(index) {
  const question = quizQuestions[index];
  questionElement.textContent = question.question;
  questionElement.classList.remove('appear');
  
  // Trigger reflow to restart animation
  void questionElement.offsetWidth;
  questionElement.classList.add('appear');
  
  // Clear previous options
  optionsElement.innerHTML = '';
  
  // Create option elements
  question.options.forEach((option, i) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option', 'appear');
    optionElement.style.animationDelay = `${i * 0.1}s`;
    optionElement.textContent = option;
    optionElement.dataset.index = i;
    optionElement.addEventListener('click', () => selectOption(optionElement, i));
    optionsElement.appendChild(optionElement);
  });
  
  // Hide info container and reset selected option
  infoContainerElement.classList.remove('visible');
  selectedOption = null;
  
  // Hide next button until an option is selected
  nextButtonElement.style.display = 'none';
}

// Handle option selection
function selectOption(optionElement, index) {
  // If already answered, do nothing
  if (infoContainerElement.classList.contains('visible')) return;
  
  // Haptic feedback effect (subtle scale)
  optionElement.style.transform = 'scale(0.98)';
  setTimeout(() => {
    optionElement.style.transform = 'scale(1)';
  }, 100);
  
  // Remove selected class from all options
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selected class to clicked option
  optionElement.classList.add('selected');
  selectedOption = index;
  
  // Check answer
  checkAnswer();
}

// Check the selected answer
function checkAnswer() {
  const question = quizQuestions[currentQuestion];
  const options = document.querySelectorAll('.option');
  
  if (selectedOption !== null) {
    const correctIndex = question.correctAnswer;
    
    // Add correct/incorrect classes
    options.forEach((option, index) => {
      if (index === correctIndex) {
        option.classList.add('correct');
      } else if (index === selectedOption) {
        option.classList.add('incorrect');
      }
    });
    
    // Show info text with slight delay for better UX
    setTimeout(() => {
      infoTextElement.textContent = question.info;
      infoContainerElement.classList.add('visible');
    }, 500);
    
    // Update score if correct
    if (selectedOption === correctIndex) {
      // Add delay for better user experience
      setTimeout(() => {
        score += 10;
        updateScore(true);
        showCelebration();
      }, 300);
    }
    
    // Update badges based on categories
    updateBadges(question.category, selectedOption === correctIndex);
    
    // Show next button with slight delay
    setTimeout(() => {
      nextButtonElement.style.display = 'block';
      nextButtonElement.classList.add('appear');
    }, 1000);
    
    // Increment answered questions
    answeredQuestions++;
    updateProgress();
  }
}

// Move to next question
function handleNextQuestion() {
  // Animation for next button
  nextButtonElement.style.transform = 'scale(0.95)';
  setTimeout(() => {
    nextButtonElement.style.transform = 'scale(1)';
  }, 100);
  
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    // Quiz completed
    questionElement.textContent = "🎉 Congratulations! You've completed the SRHR Quest!";
    optionsElement.innerHTML = '';
    infoContainerElement.classList.add('visible');
    infoTextElement.innerHTML = `<p>You scored <strong>${score}</strong> points out of <strong>${quizQuestions.length * 10}</strong> possible points!</p>
    <p>Check out the other tabs to learn more about Sexual & Reproductive Health and Rights!</p>
    <p>Remember: Knowledge is power when it comes to your body and your rights.</p>`;
    
    // Create a restart button
    const restartButton = document.createElement('button');
    restartButton.id = 'restartBtn';
    restartButton.textContent = 'Restart Quiz';
    restartButton.style.cssText = `
      background: linear-gradient(135deg, #ff5757, #ff8c57);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 14px 30px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin: 20px auto 0;
      display: block;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(255, 87, 87, 0.3);
    `;
    
    restartButton.addEventListener('mouseenter', () => {
      restartButton.style.transform = 'translateY(-3px)';
      restartButton.style.boxShadow = '0 6px 15px rgba(255, 87, 87, 0.4)';
    });
    
    restartButton.addEventListener('mouseleave', () => {
      restartButton.style.transform = 'translateY(0)';
      restartButton.style.boxShadow = '0 4px 12px rgba(255, 87, 87, 0.3)';
    });
    
    restartButton.addEventListener('click', () => {
      // Reset game state
      currentQuestion = 0;
      score = 0;
      answeredQuestions = 0;
      
      // Remove restart button
      optionsElement.innerHTML = '';
      
      // Reset and restart game
      loadQuestion(currentQuestion);
      updateScore();
      updateProgress();
      
      // Hide next button
      nextButtonElement.style.display = 'none';
      
      // Show major celebration
      showBigCelebration();
    });
    
    optionsElement.appendChild(restartButton);
    nextButtonElement.style.display = 'none';
    
    // Show big celebration
    showBigCelebration();
  }
}

// Handle tab navigation
function handleTabChange(e) {
  // Add click feedback
  e.target.style.transform = 'scale(0.95)';
  setTimeout(() => {
    e.target.style.transform = 'scale(1)';
  }, 100);
  
  const tabName = e.target.dataset.section;
  
  // Update active tab
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Show selected section
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  if (tabName === 'quiz') {
    document.getElementById('quizSection').classList.add('active');
  } else {
    document.getElementById(`${tabName}Section`).classList.add('active');
  }
}

// Update score display
function updateScore(animate = false) {
  scoreElement.textContent = `Score: ${score}`;
  
  if (animate) {
    scoreElement.classList.remove('pulse');
    // Trigger reflow to restart animation
    void scoreElement.offsetWidth;
    scoreElement.classList.add('pulse');
  }
}

// Update progress bar and text
function updateProgress() {
  const progressPercentage = (answeredQuestions / quizQuestions.length) * 100;
  
  // Animate progress bar
  progressBarElement.style.width = `${progressPercentage}%`;
  progressTextElement.textContent = `${Math.round(progressPercentage)}%`;
  
  // Make progress text more visible when bar is filling
  if (progressPercentage > 50) {
    progressTextElement.style.color = 'white';
  } else {
    progressTextElement.style.color = 'var(--primary-dark)';
  }
}

// Update badges based on answers
function updateBadges(category, isCorrect) {
  if (!isCorrect) return;
  
  // Get category counts from current quiz state
  const categoryCorrectAnswers = {
    consent: 0,
    contraception: 0,
    health: 0,
    rights: 0
  };
  
  // Count correct answers by category based on current progress
  for (let i = 0; i < answeredQuestions; i++) {
    const question = quizQuestions[i];
    const selectedOption = document.querySelectorAll('.option')[i * 4 + question.correctAnswer];
    
    // If this question has been answered correctly
    if (i < currentQuestion && selectedOption && selectedOption.classList.contains('correct')) {
      categoryCorrectAnswers[question.category]++;
    }
  }
  
  // For the current question
  if (isCorrect) {
    categoryCorrectAnswers[category]++;
  }
  
  // Award badges based on correct answers
  if (categoryCorrectAnswers.consent >= 2 && !earnedBadges.badge1) {
    earnedBadges.badge1 = true;
    const badge = document.getElementById('badge1');
    
    // Animate badge earning
    setTimeout(() => {
      badge.classList.add('earned');
      badge.style.transform = 'scale(1.2) rotate(5deg)';
      setTimeout(() => {
        badge.style.transform = 'scale(1.05) rotate(0)';
      }, 500);
      
      showToast('🤝 Consent Champion', 'You\'ve earned the Consent Champion badge!');
    }, 800);
  }
  
  if (categoryCorrectAnswers.contraception >= 2 && !earnedBadges.badge2) {
    earnedBadges.badge2 = true;
    const badge = document.getElementById('badge2');
    
    setTimeout(() => {
      badge.classList.add('earned');
      badge.style.transform = 'scale(1.2) rotate(5deg)';
      setTimeout(() => {
        badge.style.transform = 'scale(1.05) rotate(0)';
      }, 500);
      
      showToast('🛡️ Contraception Expert', 'You\'ve earned the Contraception Expert badge!');
    }, 800);
  }
  
  if (categoryCorrectAnswers.health >= 2 && !earnedBadges.badge3) {
    earnedBadges.badge3 = true;
    const badge = document.getElementById('badge3');
    
    setTimeout(() => {
      badge.classList.add('earned');
      badge.style.transform = 'scale(1.2) rotate(5deg)';
      setTimeout(() => {
        badge.style.transform = 'scale(1.05) rotate(0)';
      }, 500);
      
      showToast('💪 Health Advocate', 'You\'ve earned the Health Advocate badge!');
    }, 800);
  }
  
  if (categoryCorrectAnswers.rights >= 2 && !earnedBadges.badge4) {
    earnedBadges.badge4 = true;
    const badge = document.getElementById('badge4');
    
    setTimeout(() => {
      badge.classList.add('earned');
      badge.style.transform = 'scale(1.2) rotate(5deg)';
      setTimeout(() => {
        badge.style.transform = 'scale(1.05) rotate(0)';
      }, 500);
      
      showToast('⚖️ Rights Defender', 'You\'ve earned the Rights Defender badge!');
    }, 800);
  }
}

// Show celebration animation
function showCelebration() {
  // Get the correct answer option
  const correctOption = document.querySelector('.option.correct');
  
  // Create a small burst of particles around the correct answer
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: ${getRandomColor()};
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      opacity: 0;
    `;
    
    // Position particles at the correct answer
    const rect = correctOption.getBoundingClientRect();
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    
    // Animate particles
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 80;
    const duration = 600 + Math.random() * 400;
    
    particle.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0)', 
        opacity: 1 
      },
      { 
        transform: `translate(
          calc(-50% + ${Math.cos(angle) * distance}px), 
          calc(-50% + ${Math.sin(angle) * distance}px)
        ) scale(${0.5 + Math.random()})`,
        opacity: 0
      }
    ], { 
      duration: duration,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
    });
    
    document.body.appendChild(particle);
    setTimeout(() => {
      document.body.removeChild(particle);
    }, duration);
  }
}

// Show big celebration at the end of quiz
function showBigCelebration() {
  celebrationElement.classList.add('show');
  
  // Animate confetti
  const confetti = document.querySelectorAll('.confetti');
  confetti.forEach((particle) => {
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() * 200 - 100);
    
    particle.style.opacity = '1';
    particle.animate([
      { 
        transform: `translate(${startX}px, -20px) rotate(0deg)`, 
        opacity: 1 
      },
      { 
        transform: `translate(${endX}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`, 
        opacity: 0 
      }
    ], { 
      duration: 2000 + Math.random() * 1000,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      delay: Math.random() * 500
    });
  });
  
  setTimeout(() => {
    celebrationElement.classList.remove('show');
    confetti.forEach(particle => {
      particle.style.opacity = '0';
    });
  }, 3000);
}

// Show toast notification
function showToast(title, message) {
  // Remove any existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.classList.add('toast');
  
  const toastContent = `
    <div class="toast-icon">🎉</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  toast.innerHTML = toastContent;
  document.body.appendChild(toast);
  
  // Show toast with slight delay
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Add hover effect
  toast.addEventListener('mouseenter', () => {
    toast.style.transform = 'translateY(-5px)';
    toast.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
  });
  
  toast.addEventListener('mouseleave', () => {
    toast.style.transform = 'translateY(0)';
    toast.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
  });
  
  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    
    // Remove toast from DOM after animation
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Add easter egg for rapid clicking
let clickCount = 0;
let clickTimer;
document.addEventListener('click', () => {
  clickCount++;
  
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    if (clickCount >= 8) {
      showToast('🚀 Speed Clicker!', 'You found an easter egg! You must be excited about learning!');
      
      // Add a quick flash effect to the screen
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.7);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
      `;
      
      document.body.appendChild(flash);
      flash.animate([
        { opacity: 0.7 },
        { opacity: 0 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
      
      setTimeout(() => {
        document.body.removeChild(flash);
      }, 500);
    }
    clickCount = 0;
  }, 2000);
});

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', initGame);