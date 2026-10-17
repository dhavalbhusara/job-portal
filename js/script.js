/**
 * JobUdaan - Main Script (js/script.js)
 * Global site interactions: Navbar updates, Mobile menu, Daily GK quiz, Toast alerts.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  setupMobileDrawer();
  setupDailyGkWidget();
  setupHeroSearch();
});

// Toast Notification Helper
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Update Header Navbar according to logged in user
function setupNavbarAuth() {
  const user = AuthService.getCurrentUser();
  const authNavContainer = document.getElementById("nav-auth-container");
  if (!authNavContainer) return;

  if (user) {
    const isEditor = user.role === "MCQ_EDITOR";
    const isAdmin = user.role === "ADMIN";

    authNavContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        ${isAdmin ? `
          <a href="admin.html" class="btn btn-sm btn-outline" style="border-color: #7C3AED; color: #7C3AED;">
            🏛️ Admin Portal
          </a>
        ` : isEditor ? `
          <a href="admin.html?tab=mcq" class="btn btn-sm btn-accent">
            📝 JSON MCQ Studio
          </a>
        ` : ''}

        <div class="user-pill">
          <div class="user-avatar">${(user.name || "U")[0].toUpperCase()}</div>
          <span>${(user.name || "User").split(" ")[0]}</span>
          <span class="user-role-tag">${user.role === 'MCQ_EDITOR' ? 'MCQ Editor' : user.role === 'ADMIN' ? 'Admin' : 'Candidate'}</span>
        </div>

        <button onclick="AuthService.logout()" title="Logout" style="background: transparent; color: #EF4444; font-weight: 800; cursor: pointer; padding: 4px;">
          🚪
        </button>
      </div>
    `;
  } else {
    authNavContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <button onclick="openAuthModal('login')" class="btn btn-outline btn-sm">
          Sign In
        </button>
        <button onclick="openAuthModal('register')" class="btn btn-primary btn-sm">
          Register
        </button>
      </div>
    `;
  }
}

// Mobile Hamburger Toggle
function setupMobileDrawer() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    drawer.classList.toggle("open");
  });
}

// Daily GK Interactive Quiz
function setupDailyGkWidget() {
  const gkBox = document.getElementById("daily-gk-widget");
  if (!gkBox) return;

  const gk = DataStore.getDailyGK();
  if (!gk) return;

  const qEl = document.getElementById("gk-q-text");
  const optionsEl = document.getElementById("gk-options-container");
  const expEl = document.getElementById("gk-explanation");

  if (qEl) qEl.textContent = gk.question;
  if (optionsEl) {
    optionsEl.innerHTML = gk.options.map((opt, idx) => `
      <button class="gk-opt-btn" onclick="handleGkAnswer(this, ${opt.isCorrect})">
        <strong>${String.fromCharCode(65 + idx)})</strong> ${opt.text}
      </button>
    `).join("");
  }
  if (expEl) expEl.textContent = `સમજૂતી: ${gk.explanation}`;
}

window.handleGkAnswer = function(btnElement, isCorrect) {
  const expEl = document.getElementById("gk-explanation");
  const allBtns = document.querySelectorAll(".gk-opt-btn");
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btnElement.classList.add("correct");
    showToast("🎉 ખૂબ સરસ! તમારો જવાબ સાચો છે.");
  } else {
    btnElement.classList.add("wrong");
    showToast("❌ ખોટો જવાબ. સાચો જવાબ નીચે જુઓ.", "error");
  }

  if (expEl) expEl.style.display = "block";
};

// Hero Search form submission
function setupHeroSearch() {
  const heroForm = document.getElementById("hero-search-form");
  if (!heroForm) return;

  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("hero-search-text").value.trim();
    const sector = document.getElementById("hero-search-sector").value;
    window.location.href = `jobs.html?q=${encodeURIComponent(query)}&sector=${encodeURIComponent(sector)}`;
  });
}

// Global Auth Modal (Login / Register / Google / 1-Click Accounts)
window.openAuthModal = function(initialTab = "login") {
  let modal = document.getElementById("auth-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card">
        <button class="modal-close" onclick="closeAuthModal()">✕</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 22px; font-weight: 900; color: #0F172A;">
            Job<span style="color: #F58220;">Udaan</span> Gateway
          </h2>
          <p style="font-size: 13px; color: #64748B;">National Government & Corporate Career Portal</p>
        </div>

        <!-- Tab switcher -->
        <div style="display: flex; border-bottom: 1px solid #E2E8F0; margin-bottom: 16px;">
          <button id="auth-tab-btn-login" onclick="switchAuthModalTab('login')" style="flex: 1; padding: 10px; font-weight: 800; font-size: 14px; background: transparent; border-bottom: 2px solid #0F2942; color: #0F2942;">
            Sign In
          </button>
          <button id="auth-tab-btn-register" onclick="switchAuthModalTab('register')" style="flex: 1; padding: 10px; font-weight: 800; font-size: 14px; background: transparent; border-bottom: 2px solid transparent; color: #64748B;">
            Sign Up
          </button>
        </div>

        <div id="auth-modal-error" style="display: none; background: #FEF2F2; border: 1px solid #FCA5A5; color: #B91C1C; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 12px;"></div>

        <!-- Login Form -->
        <form id="modal-login-form" onsubmit="handleModalLogin(event)" style="display: block;">
          <div class="form-group">
            <label>ઈમેઇલ (Email Address)</label>
            <input type="email" id="modal-login-email" required class="form-control" style="background: #F8FAFC; color: #0F172A; border-color: #CBD5E1;" placeholder="candidate@jobudaan.in">
          </div>
          <div class="form-group">
            <label>પાસવર્ડ (Password)</label>
            <input type="password" id="modal-login-pass" required class="form-control" style="background: #F8FAFC; color: #0F172A; border-color: #CBD5E1;" placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 8px;">
            Sign In & Open Website →
          </button>
        </form>

        <!-- Register Form -->
        <form id="modal-register-form" onsubmit="handleModalRegister(event)" style="display: none;">
          <div class="form-group">
            <label>પૂરું નામ (Full Name)</label>
            <input type="text" id="modal-reg-name" required class="form-control" style="background: #F8FAFC; color: #0F172A; border-color: #CBD5E1;" placeholder="e.g. Rahul Sharma">
          </div>
          <div class="form-group">
            <label>ઈમેઇલ (Email Address)</label>
            <input type="email" id="modal-reg-email" required class="form-control" style="background: #F8FAFC; color: #0F172A; border-color: #CBD5E1;" placeholder="rahul@example.com">
          </div>
          <div class="form-group">
            <label>પાસવર્ડ બનાવો (Create Password)</label>
            <input type="password" id="modal-reg-pass" required class="form-control" style="background: #F8FAFC; color: #0F172A; border-color: #CBD5E1;" placeholder="At least 6 chars">
          </div>
          <button type="submit" class="btn btn-emerald btn-lg" style="width: 100%; margin-top: 8px;">
            Create Free Account →
          </button>
        </form>

        <!-- OR Divider -->
        <div style="display: flex; align-items: center; margin: 16px 0;">
          <div style="flex: 1; border-top: 1px solid #E2E8F0;"></div>
          <span style="padding: 0 10px; font-size: 11px; font-weight: 800; color: #94A3B8;">OR</span>
          <div style="flex: 1; border-top: 1px solid #E2E8F0;"></div>
        </div>

        <!-- Google 1-Click Sign In -->
        <button onclick="handleModalGoogleLogin()" class="btn btn-outline" style="width: 100%; padding: 10px; font-size: 13px;">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- 1-Click Staff & Personal Accounts -->
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #F1F5F9;">
          <span style="font-size: 11px; font-weight: 800; color: #475569; display: block; margin-bottom: 8px;">
            ⚡ 1-Click Personal & Staff Logins:
          </span>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
            <button onclick="quickLogin('dhaval@careersetu.com', '123456')" class="btn btn-outline btn-sm" style="background: #FFFBEB; border-color: #FDE68A; color: #92400E; font-size: 11px;">
              📝 Dhaval (MCQ)
            </button>
            <button onclick="quickLogin('tushar@careersetu.com', '123456')" class="btn btn-outline btn-sm" style="background: #FFF7ED; border-color: #FED7AA; color: #9A3412; font-size: 11px;">
              📝 Tushar (MCQ)
            </button>
            <button onclick="quickLogin('admin@careersetu.com', '123456')" class="btn btn-outline btn-sm" style="background: #FAF5FF; border-color: #E9D5FF; color: #6B21A8; font-size: 11px;">
              🏛️ Super Admin
            </button>
            <button onclick="quickLogin('candidate@jobudaan.in', '123456')" class="btn btn-outline btn-sm" style="background: #EFF6FF; border-color: #BFDBFE; color: #1E40AF; font-size: 11px;">
              ⚡ Candidate Demo
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  switchAuthModalTab(initialTab);
  modal.classList.add("open");
};

window.closeAuthModal = function() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.remove("open");
};

window.switchAuthModalTab = function(tab) {
  const loginForm = document.getElementById("modal-login-form");
  const regForm = document.getElementById("modal-register-form");
  const loginBtn = document.getElementById("auth-tab-btn-login");
  const regBtn = document.getElementById("auth-tab-btn-register");

  if (tab === "login") {
    if (loginForm) loginForm.style.display = "block";
    if (regForm) regForm.style.display = "none";
    if (loginBtn) {
      loginBtn.style.borderBottomColor = "#0F2942";
      loginBtn.style.color = "#0F2942";
    }
    if (regBtn) {
      regBtn.style.borderBottomColor = "transparent";
      regBtn.style.color = "#64748B";
    }
  } else {
    if (loginForm) loginForm.style.display = "none";
    if (regForm) regForm.style.display = "block";
    if (loginBtn) {
      loginBtn.style.borderBottomColor = "transparent";
      loginBtn.style.color = "#64748B";
    }
    if (regBtn) {
      regBtn.style.borderBottomColor = "#059669";
      regBtn.style.color = "#059669";
    }
  }
};

window.handleModalLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById("modal-login-email").value;
  const pass = document.getElementById("modal-login-pass").value;
  const res = AuthService.login(email, pass);
  if (res.success) {
    closeAuthModal();
    setupNavbarAuth();
    showToast("🎉 Welcome back!");
    if (res.redirectUrl && res.redirectUrl !== window.location.pathname) {
      window.location.href = res.redirectUrl;
    }
  } else {
    const err = document.getElementById("auth-modal-error");
    if (err) {
      err.textContent = res.error;
      err.style.display = "block";
    }
  }
};

window.handleModalRegister = function(e) {
  e.preventDefault();
  const name = document.getElementById("modal-reg-name").value;
  const email = document.getElementById("modal-reg-email").value;
  const pass = document.getElementById("modal-reg-pass").value;

  const res = AuthService.register({ name, email, password: pass });
  if (res.success) {
    closeAuthModal();
    setupNavbarAuth();
    showToast("🎉 Account created successfully!");
  } else {
    const err = document.getElementById("auth-modal-error");
    if (err) {
      err.textContent = res.error;
      err.style.display = "block";
    }
  }
};

window.handleModalGoogleLogin = function() {
  const res = AuthService.loginWithGoogle();
  if (res.success) {
    closeAuthModal();
    setupNavbarAuth();
    showToast("🎉 Signed in with Google!");
  }
};

window.quickLogin = function(email, pass) {
  const res = AuthService.login(email, pass);
  if (res.success) {
    closeAuthModal();
    window.location.href = res.redirectUrl;
  }
};
