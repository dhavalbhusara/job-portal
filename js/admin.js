/**
 * JobUdaan - Admin Portal Logic (js/admin.js)
 * Supports:
 * 1. Admin & Editor Authentication Check
 * 2. New Job Posting form with instant persistence
 * 3. JSON Mock Test Generator for Dhaval & Tushar
 * 4. Sample JSON Loader
 * 5. Manage existing jobs
 */

const SAMPLE_MOCK_JSON = `{
  "title": "GSSSB Senior Clerk & Head Clerk Model Paper 2026",
  "category": "GSSSB",
  "categoryName": "GSSSB CCE",
  "totalQuestions": 25,
  "durationMinutes": 30,
  "totalMarks": 25,
  "negativeMarks": 0.25,
  "language": "Gujarati",
  "difficulty": "Medium",
  "description": "Comprehensive practice paper for GSSSB Clerk exams covering Gujarati Grammar, Reasoning, and Constitution.",
  "questions": [
    {
      "id": 1,
      "question": "નીચેનામાંથી કયો શબ્દ 'અલંકાર' નો સાચો પ્રકાર નથી?",
      "options": {
        "A": "ઉપમા",
        "B": "રૂપક",
        "C": "છંદાવલી",
        "D": "ઉત્પ્રેક્ષા"
      },
      "correctAnswer": "C",
      "explanation": "ઉપમા, રૂપક અને ઉત્પ્રેક્ષા એ અર્થાલંકારના પ્રકારો છે, જ્યારે છંદાવલી એ કોઈ અલંકાર નથી.",
      "subject": "Gujarati Grammar"
    },
    {
      "id": 2,
      "question": "ગુજરાત પંચાયત અધિનિયમ કયા વર્ષમાં પસાર કરવામાં આવ્યો હતો?",
      "options": {
        "A": "1961",
        "B": "1993",
        "C": "1950",
        "D": "2002"
      },
      "correctAnswer": "B",
      "explanation": "73મા બંધારણીય સુધારા બાદ ગુજરાતમાં 'ગુજરાત પંચાયત અધિનિયમ, 1993' અમલમાં આવ્યો હતો.",
      "subject": "Panchayati Raj"
    }
  ]
}`;

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = AuthService.getCurrentUser();
  const loginGate = document.getElementById("admin-login-gate");
  const adminPanel = document.getElementById("admin-panel-content");
  const userGreeting = document.getElementById("admin-user-greeting");
  const editorBadge = document.getElementById("admin-role-badge");

  // Check query parameter for initial tab e.g. ?tab=mcq
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get("tab") || "mcq";

  if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "MCQ_EDITOR")) {
    if (loginGate) loginGate.style.display = "block";
    if (adminPanel) adminPanel.style.display = "none";
    setupAdminLogin();
    return;
  }

  // User is authorized
  if (loginGate) loginGate.style.display = "none";
  if (adminPanel) adminPanel.style.display = "block";

  if (userGreeting) userGreeting.textContent = currentUser.name;
  if (editorBadge) {
    if (currentUser.role === "MCQ_EDITOR") {
      editorBadge.innerHTML = `📝 Personal Editor: ${currentUser.name.split(" ")[0]}`;
      editorBadge.className = "editor-badge";
      // Hide full job posting tab for MCQ Editors so they only focus on MCQs
      const jobPostTabBtn = document.getElementById("tab-btn-post-job");
      if (jobPostTabBtn) jobPostTabBtn.style.display = "none";
      switchTab("mcq");
    } else {
      editorBadge.innerHTML = `🏛️ Super Admin`;
      editorBadge.className = "editor-badge";
      switchTab(requestedTab);
    }
  }

  setupJobPostingForm();
  setupJsonMcqUploader();
  renderAdminStats();
  renderAdminJobsTable();
});

function setupAdminLogin() {
  const form = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-login-email");
  const passInput = document.getElementById("admin-login-pass");
  const errorMsg = document.getElementById("admin-login-error");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = AuthService.login(emailInput.value, passInput.value);
    if (res.success) {
      window.location.href = res.redirectUrl;
    } else {
      if (errorMsg) {
        errorMsg.textContent = res.error;
        errorMsg.style.display = "block";
      }
    }
  });

  // Quick Account Login Buttons (Dhaval, Tushar, Admin)
  window.quickAdminLogin = function(email, pass) {
    const res = AuthService.login(email, pass);
    if (res.success) {
      window.location.href = res.redirectUrl;
    }
  };
}

function switchTab(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.style.display = "none");

  const targetBtn = document.getElementById(`tab-btn-${tabName}`);
  const targetPane = document.getElementById(`tab-pane-${tabName}`);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetPane) targetPane.style.display = "block";
}

function setupJobPostingForm() {
  const jobForm = document.getElementById("post-job-form");
  if (!jobForm) return;

  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newJob = {
      title: document.getElementById("new-job-title").value.trim(),
      organization: document.getElementById("new-job-org").value.trim(),
      sector: document.getElementById("new-job-sector").value,
      department: document.getElementById("new-job-dept").value.trim(),
      vacancies: parseInt(document.getElementById("new-job-vacancies").value) || 1,
      salary: document.getElementById("new-job-salary").value.trim(),
      qualification: document.getElementById("new-job-qual").value.trim(),
      state: document.getElementById("new-job-state").value,
      city: document.getElementById("new-job-city").value.trim(),
      lastDate: document.getElementById("new-job-lastdate").value,
      applyUrl: document.getElementById("new-job-applyurl").value.trim() || "#",
      description: document.getElementById("new-job-desc").value.trim(),
    };

    DataStore.saveJob(newJob);
    showToast("🎉 Job Posted Successfully!");
    jobForm.reset();
    renderAdminStats();
    renderAdminJobsTable();
  });
}

function setupJsonMcqUploader() {
  const jsonTextarea = document.getElementById("mcq-json-input");
  const uploadBtn = document.getElementById("mcq-json-submit-btn");
  const sampleBtn = document.getElementById("mcq-load-sample-btn");
  const fileInput = document.getElementById("mcq-json-file-input");
  const statusBox = document.getElementById("mcq-upload-status");

  if (!jsonTextarea) return;

  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      jsonTextarea.value = SAMPLE_MOCK_JSON;
      showToast("Sample JSON Template Loaded");
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            JSON.parse(event.target.result);
            jsonTextarea.value = event.target.result;
            showToast(`Loaded ${file.name} successfully!`);
          } catch {
            showToast("Invalid JSON file!", "error");
          }
        };
        reader.readAsText(file);
      }
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const raw = jsonTextarea.value.trim();
      if (!raw) {
        showToast("Please enter or paste JSON code", "error");
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
          showToast("JSON must contain 'title' and array of 'questions'", "error");
          return;
        }

        DataStore.saveMockTest(parsed);
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981; color: #6EE7B7; padding: 12px 16px; border-radius: 8px; font-weight: bold; font-size: 13px;">
              🎉 Mock Test "${parsed.title}" (${parsed.questions.length} questions) Created Successfully!
            </div>
          `;
        }
        showToast("🎉 Mock Test created from JSON!");
        renderAdminStats();
      } catch (err) {
        showToast("JSON Syntax Error: " + err.message, "error");
      }
    });
  }
}

function renderAdminStats() {
  const jobs = DataStore.getJobs();
  const tests = DataStore.getMockTests();

  const totalJobsEl = document.getElementById("admin-stat-total-jobs");
  const govtJobsEl = document.getElementById("admin-stat-govt-jobs");
  const pvtJobsEl = document.getElementById("admin-stat-pvt-jobs");
  const totalTestsEl = document.getElementById("admin-stat-total-tests");

  if (totalJobsEl) totalJobsEl.textContent = jobs.length;
  if (govtJobsEl) govtJobsEl.textContent = jobs.filter(j => j.sector === "GOVERNMENT").length;
  if (pvtJobsEl) pvtJobsEl.textContent = jobs.filter(j => j.sector === "PRIVATE").length;
  if (totalTestsEl) totalTestsEl.textContent = tests.length;
}

function renderAdminJobsTable() {
  const tbody = document.getElementById("admin-jobs-tbody");
  if (!tbody) return;

  const jobs = DataStore.getJobs();
  if (jobs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94A3B8;">No jobs found</td></tr>`;
    return;
  }

  tbody.innerHTML = jobs.map(j => `
    <tr>
      <td style="font-weight: 800; color: #fff;">${j.title}</td>
      <td>${j.organization}</td>
      <td>
        <span class="sector-badge ${j.sector === 'GOVERNMENT' ? 'govt' : 'pvt'}">
          ${j.sector}
        </span>
      </td>
      <td>${j.lastDate}</td>
      <td>
        <button onclick="deleteJob('${j.id}')" style="background: transparent; color: #F87171; font-weight: 800; cursor: pointer;">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

window.deleteJob = function(jobId) {
  if (!confirm("Are you sure you want to remove this job?")) return;
  const jobs = DataStore.getJobs().filter(j => j.id !== jobId);
  localStorage.setItem("jobudaan_jobs", JSON.stringify(jobs));
  showToast("Job removed");
  renderAdminStats();
  renderAdminJobsTable();
};
