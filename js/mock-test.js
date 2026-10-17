/**
 * JobUdaan - Mock Test Engine (js/mock-test.js)
 * Interactive Computer-Based Test (CBT) Runner with timer, automatic scoring, review, and explanations.
 */

let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let testTimer = null;
let timeRemainingSeconds = 0;

document.addEventListener("DOMContentLoaded", () => {
  const testSelector = document.getElementById("mock-tests-grid");
  const testScreen = document.getElementById("test-runner-screen");
  const resultScreen = document.getElementById("test-result-screen");

  renderAvailableTests();
});

function renderAvailableTests() {
  const container = document.getElementById("mock-tests-grid");
  if (!container) return;

  const tests = DataStore.getMockTests();
  container.innerHTML = tests.map(test => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 800; background: #DBEAFE; color: #1D4ED8; padding: 3px 8px; border-radius: 6px;">
            ${test.categoryName || test.category}
          </span>
          <span style="font-size: 12px; font-weight: 700; color: #64748B;">
            ⏱️ ${test.durationMinutes || 30} Mins
          </span>
        </div>

        <h3 style="font-size: 17px; font-weight: 900; color: #0F172A; margin-bottom: 8px;">
          ${test.title}
        </h3>
        <p style="font-size: 13px; color: #475569; margin-bottom: 16px; line-height: 1.5;">
          ${test.description || 'Practice model paper with comprehensive questions and instant explanations.'}
        </p>

        <div style="background: #F8FAFC; padding: 10px; border-radius: 10px; margin-bottom: 16px; font-size: 12px; display: flex; justify-content: space-between;">
          <span><strong>${test.questions ? test.questions.length : test.totalQuestions}</strong> પ્રશ્નો (MCQs)</span>
          <span>નેગેટિવ માર્કિંગ: <strong>0.25</strong></span>
        </div>
      </div>

      <button onclick="startTest('${test.id}')" class="btn btn-primary" style="width: 100%;">
        ટેસ્ટ શરૂ કરો (Start Test) 🚀
      </button>
    </div>
  `).join("");
}

window.startTest = function(testId) {
  const tests = DataStore.getMockTests();
  currentTest = tests.find(t => t.id === testId);
  if (!currentTest || !currentTest.questions || currentTest.questions.length === 0) {
    alert("આ ટેસ્ટમાં પ્રશ્નો ઉપલબ્ધ નથી.");
    return;
  }

  currentQuestionIndex = 0;
  userAnswers = {};
  timeRemainingSeconds = (currentTest.durationMinutes || 30) * 60;

  document.getElementById("tests-list-section").style.display = "none";
  document.getElementById("test-runner-screen").style.display = "block";
  document.getElementById("test-result-screen").style.display = "none";

  document.getElementById("active-test-title").textContent = currentTest.title;

  startTimer();
  renderQuestion();
  renderPalette();
};

function startTimer() {
  if (testTimer) clearInterval(testTimer);
  updateTimerDisplay();
  testTimer = setInterval(() => {
    timeRemainingSeconds--;
    updateTimerDisplay();
    if (timeRemainingSeconds <= 0) {
      clearInterval(testTimer);
      submitTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("test-countdown-timer");
  if (!timerEl) return;
  const mins = Math.floor(timeRemainingSeconds / 60);
  const secs = timeRemainingSeconds % 60;
  timerEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  if (timeRemainingSeconds < 300) {
    timerEl.style.color = "#DC2626";
  } else {
    timerEl.style.color = "#2563EB";
  }
}

function renderQuestion() {
  const q = currentTest.questions[currentQuestionIndex];
  if (!q) return;

  document.getElementById("current-q-num").textContent = `Question ${currentQuestionIndex + 1} of ${currentTest.questions.length}`;
  document.getElementById("current-q-subject").textContent = q.subject || currentTest.category;
  document.getElementById("current-q-text").textContent = q.question;

  const optionsContainer = document.getElementById("current-q-options");
  optionsContainer.innerHTML = "";

  const optionsObj = q.options || {};
  Object.keys(optionsObj).forEach(key => {
    const isSelected = userAnswers[currentQuestionIndex] === key;
    const btn = document.createElement("button");
    btn.className = `btn btn-outline ${isSelected ? 'active-opt' : ''}`;
    btn.style.cssText = `
      width: 100%;
      text-align: left;
      justify-content: flex-start;
      padding: 12px 16px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      ${isSelected ? 'background: #EFF6FF; border-color: #2563EB; color: #1D4ED8;' : ''}
    `;
    btn.innerHTML = `<strong>(${key})</strong> ${optionsObj[key]}`;
    btn.onclick = () => {
      userAnswers[currentQuestionIndex] = key;
      renderQuestion();
      renderPalette();
    };
    optionsContainer.appendChild(btn);
  });

  // Prev / Next button states
  document.getElementById("btn-prev-q").disabled = currentQuestionIndex === 0;
  const nextBtn = document.getElementById("btn-next-q");
  if (currentQuestionIndex === currentTest.questions.length - 1) {
    nextBtn.textContent = "રિવ્યૂ કરો (Review)";
  } else {
    nextBtn.textContent = "આગળ (Next) →";
  }
}

function renderPalette() {
  const palette = document.getElementById("question-palette-grid");
  if (!palette) return;

  palette.innerHTML = currentTest.questions.map((q, idx) => {
    const isAnswered = userAnswers[idx] !== undefined;
    const isCurrent = idx === currentQuestionIndex;
    let bg = "#F1F5F9";
    let text = "#334155";
    let border = "1px solid #CBD5E1";

    if (isAnswered) {
      bg = "#10B981";
      text = "#ffffff";
      border = "1px solid #059669";
    }
    if (isCurrent) {
      border = "2px solid #2563EB";
    }

    return `
      <button onclick="jumpToQuestion(${idx})" style="
        width: 34px;
        height: 34px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 800;
        background: ${bg};
        color: ${text};
        border: ${border};
        cursor: pointer;
      ">
        ${idx + 1}
      </button>
    `;
  }).join("");
}

window.jumpToQuestion = function(idx) {
  currentQuestionIndex = idx;
  renderQuestion();
  renderPalette();
};

window.prevQuestion = function() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    renderPalette();
  }
};

window.nextQuestion = function() {
  if (currentQuestionIndex < currentTest.questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
    renderPalette();
  }
};

window.submitTest = function() {
  if (testTimer) clearInterval(testTimer);

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  currentTest.questions.forEach((q, idx) => {
    const selected = userAnswers[idx];
    if (selected === undefined) {
      skippedCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQ = currentTest.questions.length;
  const negativeDeduction = wrongCount * (currentTest.negativeMarks || 0.25);
  const finalScore = Math.max(0, (correctCount * 1) - negativeDeduction).toFixed(2);
  const accuracyPct = (correctCount + wrongCount > 0) ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

  document.getElementById("test-runner-screen").style.display = "none";
  document.getElementById("test-result-screen").style.display = "block";

  document.getElementById("result-final-score").textContent = `${finalScore} / ${totalQ}`;
  document.getElementById("result-accuracy").textContent = `${accuracyPct}%`;
  document.getElementById("result-correct-count").textContent = correctCount;
  document.getElementById("result-wrong-count").textContent = wrongCount;
  document.getElementById("result-skipped-count").textContent = skippedCount;

  // Render question review list with explanations
  const reviewContainer = document.getElementById("test-questions-review-list");
  reviewContainer.innerHTML = currentTest.questions.map((q, idx) => {
    const userSelected = userAnswers[idx];
    const isCorrect = userSelected === q.correctAnswer;
    const isSkipped = userSelected === undefined;

    return `
      <div style="background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong style="color: #0F172A;">Q${idx + 1}: ${q.question}</strong>
          ${isSkipped ? '<span style="color: #64748B; font-weight: 800; font-size: 12px;">Skipped</span>' : isCorrect ? '<span style="color: #059669; font-weight: 800; font-size: 12px;">✅ સાચો જવાબ (+1)</span>' : '<span style="color: #DC2626; font-weight: 800; font-size: 12px;">❌ ખોટો જવાબ (-0.25)</span>'}
        </div>
        <div style="font-size: 13px; color: #334155; margin-bottom: 8px;">
          <span>તમારો જવાબ: <strong>${userSelected || 'None'}</strong></span> | 
          <span>સાચો જવાબ: <strong style="color: #059669;">${q.correctAnswer} - ${q.options[q.correctAnswer]}</strong></span>
        </div>
        <div style="background: #F8FAFC; border-left: 3px solid #2563EB; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #475569;">
          <strong>સમજૂતી (Explanation):</strong> ${q.explanation || 'કોઈ સમજૂતી ઉપલબ્ધ નથી.'}
        </div>
      </div>
    `;
  }).join("");
};

window.exitTest = function() {
  if (confirm("શું તમે ખરેખર ટેસ્ટમાંથી બહાર નીકળવા માંગો છો?")) {
    if (testTimer) clearInterval(testTimer);
    document.getElementById("test-runner-screen").style.display = "none";
    document.getElementById("test-result-screen").style.display = "none";
    document.getElementById("tests-list-section").style.display = "block";
  }
};
