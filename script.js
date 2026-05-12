/* ============================================================
   HTBB Capture Team Onboarding — Shared JavaScript
   Progress tracking + Quiz logic
   ============================================================ */

// ── PROGRESS TRACKING ──────────────────────────────────────
const TOTAL_MODULES = 6;

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('ct_progress') || '{}');
  } catch { return {}; }
}

function markComplete(moduleNum) {
  const p = getProgress();
  p[moduleNum] = true;
  localStorage.setItem('ct_progress', JSON.stringify(p));
}

function getCompletedCount() {
  return Object.keys(getProgress()).length;
}

function isComplete(moduleNum) {
  return !!getProgress()[moduleNum];
}

// Update progress bar fill width
function updateProgressBar(pct) {
  const bar = document.querySelector('.progress-fill');
  if (bar) bar.style.width = pct + '%';
}

// Update dots row
function updateDots(current) {
  const dots = document.querySelectorAll('.mod-dot');
  const p = getProgress();
  dots.forEach((dot, i) => {
    const num = i + 1;
    dot.classList.remove('done', 'active');
    if (num === current) dot.classList.add('active');
    else if (p[num]) dot.classList.add('done');
  });
}

// On homepage: update stats
function updateHomepageStats() {
  const el = document.getElementById('completed-count');
  if (el) el.textContent = getCompletedCount();
}

// ── QUIZ LOGIC ─────────────────────────────────────────────
function initQuiz(containerId, correctIndex, feedbackCorrect, feedbackWrong) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const opts = container.querySelectorAll('.quiz-opt');
  const submitBtn = container.querySelector('.quiz-submit-btn');
  const feedback = container.querySelector('.quiz-feedback');
  let selected = null;

  opts.forEach((opt, i) => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selected = i;
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (selected === null) return;

      opts.forEach((opt, i) => {
        opt.disabled = true;
        opt.style.cursor = 'default';
        if (i === correctIndex) opt.classList.add('correct');
        else if (i === selected && i !== correctIndex) opt.classList.add('wrong');
        opt.classList.remove('selected');
      });

      feedback.style.display = 'block';
      if (selected === correctIndex) {
        feedback.className = 'quiz-feedback correct-fb';
        feedback.textContent = feedbackCorrect;
      } else {
        feedback.className = 'quiz-feedback wrong-fb';
        feedback.textContent = feedbackWrong;
      }
      submitBtn.style.display = 'none';
    });
  }
}

// ── MULTI-QUESTION QUIZ ────────────────────────────────────
// For modules with multiple questions, tracks all answers
function initMultiQuiz(questions) {
  // questions = [{ containerId, correctIndex, feedbackCorrect, feedbackWrong }]
  questions.forEach(q => initQuiz(q.containerId, q.correctIndex, q.feedbackCorrect, q.feedbackWrong));
}

// ── FAQ ACCORDION ──────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── NEXT BUTTON WITH COMPLETION ───────────────────────────
function initNextBtn(moduleNum, nextPage) {
  const btn = document.querySelector('.btn-next');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    markComplete(moduleNum);
    window.location.href = nextPage;
  });
}

// ── INIT ON LOAD ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateHomepageStats();
  initFAQ();
});
