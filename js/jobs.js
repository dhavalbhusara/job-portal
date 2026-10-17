/**
 * JobUdaan - Jobs Page Logic (js/jobs.js)
 * Supports live keyword search, sector filtering (Government / Private), state filtering, and job detail modals.
 */

document.addEventListener("DOMContentLoaded", () => {
  const jobsListContainer = document.getElementById("jobs-list");
  const searchInput = document.getElementById("job-search-input");
  const sectorFilter = document.getElementById("sector-filter");
  const stateFilter = document.getElementById("state-filter");
  const totalJobsCount = document.getElementById("total-jobs-count");

  // Read URL query params (e.g. ?sector=GOVERNMENT or ?q=clerk)
  const urlParams = new URLSearchParams(window.location.search);
  const paramSector = urlParams.get("sector");
  const paramQuery = urlParams.get("q");

  if (paramSector && sectorFilter) {
    sectorFilter.value = paramSector.toUpperCase();
  }
  if (paramQuery && searchInput) {
    searchInput.value = paramQuery;
  }

  function renderJobs() {
    if (!jobsListContainer) return;
    const allJobs = DataStore.getJobs();

    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const sector = (sectorFilter ? sectorFilter.value : "ALL").toUpperCase();
    const state = (stateFilter ? stateFilter.value : "ALL");

    const filtered = allJobs.filter(job => {
      // Sector filter
      if (sector !== "ALL" && job.sector !== sector) return false;
      // State filter
      if (state !== "ALL" && job.state !== state && job.state !== "All India") return false;
      // Keyword query
      if (query) {
        const text = `${job.title} ${job.organization} ${job.department} ${job.qualification} ${job.city}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    if (totalJobsCount) {
      totalJobsCount.textContent = `${filtered.length} Jobs Found`;
    }

    if (filtered.length === 0) {
      jobsListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">કોઈ જોબ્સ મળી નથી (No Jobs Found)</h3>
          <p style="font-size: 13px; color: #64748B;">કૃપા કરીને અલગ કીવર્ડ અથવા ફિલ્ટર અજમાવો.</p>
          <button onclick="resetFilters()" class="btn btn-primary" style="margin-top: 16px;">તમામ જોબ્સ બતાવો</button>
        </div>
      `;
      return;
    }

    jobsListContainer.innerHTML = filtered.map(job => `
      <div class="card job-card">
        <div>
          <div class="job-card-top">
            <span class="sector-badge ${job.sector === 'GOVERNMENT' ? 'govt' : 'pvt'}">
              ${job.sector === 'GOVERNMENT' ? '🏛️ Sarkari Govt' : '🏢 Private MNC'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #dc2626;">
              ⏳ Last Date: ${job.lastDate}
            </span>
          </div>

          <h3 class="job-title">${job.title}</h3>
          <div class="job-company">
            <span>🏢</span>
            <span>${job.organization}</span>
          </div>

          <div class="job-meta-grid">
            <div>
              <span class="meta-label">પગાર (Salary)</span>
              <span class="meta-val">${job.salary}</span>
            </div>
            <div>
              <span class="meta-label">જગ્યા (Vacancies)</span>
              <span class="meta-val">${job.vacancies} Posts</span>
            </div>
            <div>
              <span class="meta-label">લાયકાત (Qualification)</span>
              <span class="meta-val">${job.qualification}</span>
            </div>
            <div>
              <span class="meta-label">સ્થળ (Location)</span>
              <span class="meta-val">${job.city || job.state}</span>
            </div>
          </div>
        </div>

        <div class="job-card-actions">
          <button onclick="openJobDetail('${job.id}')" class="btn btn-outline" style="flex: 1;">
            વિગત જુઓ (Details)
          </button>
          <a href="${job.applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
            અરજી કરો (Apply) ↗
          </a>
        </div>
      </div>
    `).join("");
  }

  window.resetFilters = function() {
    if (searchInput) searchInput.value = "";
    if (sectorFilter) sectorFilter.value = "ALL";
    if (stateFilter) stateFilter.value = "ALL";
    renderJobs();
  };

  window.openJobDetail = function(jobId) {
    const jobs = DataStore.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById("job-detail-modal");
    const modalContent = document.getElementById("job-modal-body");
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="sector-badge ${job.sector === 'GOVERNMENT' ? 'govt' : 'pvt'}">
          ${job.sector === 'GOVERNMENT' ? '🏛️ Government Job' : '🏢 Corporate MNC'}
        </span>
        <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin-top: 10px;">${job.title}</h2>
        <p style="font-size: 13px; font-weight: 700; color: #475569;">${job.organization} — ${job.department || ''}</p>
      </div>

      <div class="job-meta-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 20px;">
        <div>
          <span class="meta-label">પગાર સ્કેલ</span>
          <span class="meta-val">${job.salary}</span>
        </div>
        <div>
          <span class="meta-label">કુલ જગ્યાઓ</span>
          <span class="meta-val">${job.vacancies} Posts</span>
        </div>
        <div>
          <span class="meta-label">છેલ્લી તારીખ</span>
          <span class="meta-val" style="color: #dc2626;">${job.lastDate}</span>
        </div>
        <div>
          <span class="meta-label">વય મર્યાદા (Age Limit)</span>
          <span class="meta-val">${job.ageLimit || '18-35 Years'}</span>
        </div>
        <div style="grid-column: 1 / -1;">
          <span class="meta-label">જરૂરી લાયકાત (Eligibility)</span>
          <span class="meta-val">${job.qualification}</span>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #334155; margin-bottom: 6px;">
          જોબ વર્ણન અને વિગતો (Description):
        </h4>
        <p style="font-size: 13px; color: #475569; line-height: 1.6;">
          ${job.description}
        </p>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 24px;">
        <a href="${job.applyUrl}" target="_blank" class="btn btn-primary btn-lg" style="flex: 2;">
          સત્તાવાર લિંક પરથી Apply કરો ↗
        </a>
        <button onclick="closeModal()" class="btn btn-outline btn-lg" style="flex: 1;">
          બંધ કરો
        </button>
      </div>
    `;

    modal.classList.add("open");
  };

  window.closeModal = function() {
    const modal = document.getElementById("job-detail-modal");
    if (modal) modal.classList.remove("open");
  };

  // Event Listeners
  if (searchInput) searchInput.addEventListener("input", renderJobs);
  if (sectorFilter) sectorFilter.addEventListener("change", renderJobs);
  if (stateFilter) stateFilter.addEventListener("change", renderJobs);

  renderJobs();
});
