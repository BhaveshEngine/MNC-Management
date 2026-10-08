// ════════════════════════════════════════════════════════════
//  MNC Record Management System — Enhanced Script
//  Plugins: Tailwind CSS, Bootstrap 5, Lucide Icons, Chart.js
// ════════════════════════════════════════════════════════════

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };
const USER_CREDENTIALS   = { username: 'user',  password: 'user123'  };

let currentRole = null;
let records     = [];
let attendance  = {};

// Chart instances
let deptChartInstance       = null;
let salaryChartInstance     = null;
let attendanceChartInstance = null;
let ageChartInstance        = null;

// Chart.js global theme
Chart.defaults.color      = '#94a3b8';
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size   = 11;

// ── DOM References ──────────────────────────────────────────
const loginSection              = document.getElementById('loginSection');
const dashboardSection          = document.getElementById('dashboardSection');
const loginForm                 = document.getElementById('loginForm');
const loginMessage              = document.getElementById('loginMessage');
const welcomeText               = document.getElementById('welcomeText');
const logoutBtn                 = document.getElementById('logoutBtn');
const recordForm                = document.getElementById('recordForm');
const searchInput               = document.getElementById('searchInput');
const recordsTableBody          = document.getElementById('recordsTableBody');
const attendanceEmployeeSelect  = document.getElementById('attendanceEmployeeSelect');
const attendanceStatusSelect    = document.getElementById('attendanceStatusSelect');
const markAttendanceBtn         = document.getElementById('markAttendanceBtn');
const attendanceTableBody       = document.getElementById('attendanceTableBody');
const attendanceTabButton       = document.getElementById('attendanceTabButton');
const tabButtons                = document.querySelectorAll('.tab-btn');
const tabPanels                 = document.querySelectorAll('.tab-panel');
const statsGrid                 = document.getElementById('statsGrid');
const roleBadge                 = document.getElementById('roleBadge');
const emptyRecords              = document.getElementById('emptyRecords');


// ╔═══════════════════════════════════════════════════════════╗
// ║  TOAST NOTIFICATIONS                                     ║
// ╚═══════════════════════════════════════════════════════════╝
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: 'check-circle', error: 'alert-circle', info: 'info' };
  const colors = {
    success: 'bg-emerald-600/90 border-emerald-400/30',
    error:   'bg-red-600/90 border-red-400/30',
    info:    'bg-blue-600/90 border-blue-400/30',
  };

  const toast = document.createElement('div');
  toast.className = `toast-item flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium
                     backdrop-blur-xl border shadow-lg ${colors[type] || colors.info}`;
  toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 flex-shrink-0"></i><span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  LOGIN / LOGOUT                                          ║
// ╚═══════════════════════════════════════════════════════════╝
function showMessage(element, text, isError = false) {
  element.textContent = text;
  element.style.color = isError ? '#f87171' : '#a5b4fc';
}

function login(username, password) {
  const isAdmin = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
  const isUser  = username === USER_CREDENTIALS.username  && password === USER_CREDENTIALS.password;

  if (!isAdmin && !isUser) {
    showMessage(loginMessage, 'Invalid credentials. Please try again.', true);
    loginForm.classList.add('animate-shake');
    setTimeout(() => loginForm.classList.remove('animate-shake'), 500);
    return;
  }

  currentRole = isAdmin ? 'admin' : 'user';
  loginSection.classList.add('d-hidden');
  dashboardSection.classList.remove('d-hidden');
  welcomeText.textContent = `Welcome back, ${currentRole === 'admin' ? 'Administrator' : 'User'} — ${username}`;
  showMessage(loginMessage, '');

  // Show role badge
  if (isAdmin) {
    roleBadge.className = 'inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-mnc-accentDim/20 text-mnc-accentBright border border-mnc-accentDim/30';
    roleBadge.innerHTML = '<i data-lucide="shield" class="w-3 h-3 mr-1"></i> Admin';
  } else {
    roleBadge.className = 'inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-mnc-info/20 text-mnc-info border border-mnc-info/30';
    roleBadge.innerHTML = '<i data-lucide="user" class="w-3 h-3 mr-1"></i> User';
  }

  updateAdminAccess();
  loadRecords();
  loadAttendance();
  lucide.createIcons();
  showToast(`Welcome, ${isAdmin ? 'Admin' : 'User'}! You're logged in.`, 'success');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login(document.getElementById('username').value.trim(), document.getElementById('password').value.trim());
});

logoutBtn.addEventListener('click', () => {
  currentRole = null;
  dashboardSection.classList.add('d-hidden');
  loginSection.classList.remove('d-hidden');
  loginForm.reset();
  resetForm();
  showMessage(loginMessage, '');
  showToast('You have been logged out.', 'info');
});


// ╔═══════════════════════════════════════════════════════════╗
// ║  ADMIN ACCESS CONTROL                                    ║
// ╚═══════════════════════════════════════════════════════════╝
function updateAdminAccess() {
  const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
  const isAdmin = currentRole === 'admin';

  adminOnlyElements.forEach((el) => {
    el.disabled = !isAdmin;
    el.style.opacity = isAdmin ? '1' : '0.4';
    el.style.pointerEvents = isAdmin ? 'auto' : 'none';
  });

  if (attendanceTabButton) {
    attendanceTabButton.classList.toggle('d-hidden', !isAdmin);
  }
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  DATA LOADING (API)                                      ║
// ╚═══════════════════════════════════════════════════════════╝
async function loadRecords() {
  try {
    const response = await fetch('/api/records');
    const data = await response.json();
    records = data.map((item) => ({ ...item, id: item.id || item.employeeId }));
    renderRecords();
    renderStats();
    renderCharts();
  } catch (err) {
    console.error('Failed to load records:', err);
  }
}

async function loadAttendance() {
  try {
    const response = await fetch('/api/attendance');
    const data = await response.json();
    attendance = Object.fromEntries(
      Object.entries(data).map(([employeeId, value]) => {
        if (typeof value === 'string') return [employeeId, { status: value, timestamp: '' }];
        return [employeeId, value];
      })
    );
    renderAttendance();
    renderCharts();
  } catch (err) {
    console.error('Failed to load attendance:', err);
  }
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  STATS CARDS                                             ║
// ╚═══════════════════════════════════════════════════════════╝
function renderStats() {
  const totalEmployees = records.length;
  const departments = [...new Set(records.map((r) => r.department))].length;
  const avgSalary = totalEmployees > 0
    ? (records.reduce((sum, r) => sum + r.salary, 0) / totalEmployees)
    : 0;
  const totalAttendance = Object.keys(attendance).length;

  const stats = [
    {
      label: 'Total Employees', value: totalEmployees, sub: 'Active records',
      icon: 'users', color: 'accent',
      barClass: 'bg-gradient-to-r from-mnc-accentDim to-mnc-accentBright',
    },
    {
      label: 'Departments', value: departments, sub: 'Unique departments',
      icon: 'building', color: 'success',
      barClass: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    },
    {
      label: 'Avg Salary', value: `₹${avgSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, sub: 'Across all employees',
      icon: 'indian-rupee', color: 'warning',
      barClass: 'bg-gradient-to-r from-amber-600 to-amber-400',
    },
    {
      label: 'Attendance Logged', value: totalAttendance, sub: 'Records today',
      icon: 'calendar-check', color: 'info',
      barClass: 'bg-gradient-to-r from-sky-600 to-sky-400',
    },
  ];

  const colorMap = {
    accent:  'text-mnc-accentBright',
    success: 'text-mnc-success',
    warning: 'text-mnc-warning',
    info:    'text-mnc-info',
  };

  statsGrid.innerHTML = stats.map((s, i) => `
    <div class="glass glass-hover rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-1 animate-scale-in delay-${i + 1} relative overflow-hidden group">
      <div class="stat-bar ${s.barClass} absolute top-0 left-0 right-0"></div>
      <div class="flex items-center justify-between mb-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-mnc-muted">${s.label}</span>
        <div class="w-9 h-9 rounded-xl bg-mnc-surface border border-white/[0.06] flex items-center justify-center ${colorMap[s.color]} group-hover:scale-110 transition-transform duration-300">
          <i data-lucide="${s.icon}" class="w-4 h-4"></i>
        </div>
      </div>
      <div class="text-2xl font-extrabold font-mono tracking-tight ${colorMap[s.color]}">${s.value}</div>
      <p class="text-[11px] text-mnc-muted mt-1">${s.sub}</p>
    </div>
  `).join('');

  lucide.createIcons({ nodes: [statsGrid] });
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  RECORDS TABLE                                           ║
// ╚═══════════════════════════════════════════════════════════╝
function renderRecords() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = records
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((r) =>
      [r.employeeId, r.name, r.department, r.address, r.contactNo]
        .some((v) => String(v).toLowerCase().includes(term))
    );

  recordsTableBody.innerHTML = '';

  if (filtered.length === 0) {
    emptyRecords?.classList.remove('d-hidden');
  } else {
    emptyRecords?.classList.add('d-hidden');
  }

  filtered.forEach((record, i) => {
    const row = document.createElement('tr');
    row.className = 'row-animate hover:bg-white/[0.03] transition-colors duration-150';
    row.style.animationDelay = `${i * 0.03}s`;
    row.innerHTML = `
      <td class="py-3.5 px-4 font-mono text-xs text-mnc-accentBright font-semibold">${record.employeeId}</td>
      <td class="py-3.5 px-4 font-semibold text-mnc-text">${record.name}</td>
      <td class="py-3.5 px-4 text-mnc-sub">${record.department}</td>
      <td class="py-3.5 px-4 font-mono text-mnc-sub">₹${Number(record.salary).toLocaleString('en-IN')}</td>
      <td class="py-3.5 px-4 font-mono text-xs text-mnc-sub">${record.contactNo}</td>
      <td class="py-3.5 px-4 text-mnc-sub text-xs max-w-[160px] truncate">${record.address}</td>
      <td class="py-3.5 px-4 text-center">
        <div class="flex items-center justify-center gap-2">
          <button type="button" data-action="edit" data-id="${record.id}"
            class="p-2 rounded-lg bg-mnc-card border border-mnc-border text-mnc-accentBright
                   hover:bg-mnc-cardHover hover:border-mnc-borderHover hover:scale-105
                   transition-all duration-200 shadow-none" title="Edit">
            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
          </button>
          <button type="button" data-action="delete" data-id="${record.id}"
            class="p-2 rounded-lg bg-mnc-card border border-red-500/20 text-mnc-danger
                   hover:bg-red-500/10 hover:border-red-500/40 hover:scale-105
                   transition-all duration-200 shadow-none" title="Delete">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </td>
    `;
    recordsTableBody.appendChild(row);
  });

  // Bind edit/delete + admin access
  recordsTableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.style.display = currentRole === 'admin' ? 'inline-flex' : 'none';
    btn.addEventListener('click', () => fillEditForm(btn.dataset.id));
  });
  recordsTableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.style.display = currentRole === 'admin' ? 'inline-flex' : 'none';
    btn.addEventListener('click', () => deleteRecord(btn.dataset.id));
  });

  lucide.createIcons({ nodes: [recordsTableBody] });
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  FORM HANDLING                                           ║
// ╚═══════════════════════════════════════════════════════════╝
function resetForm() {
  recordForm.reset();
  document.getElementById('recordId').value = '';
  document.getElementById('saveBtn').innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save Record';
  lucide.createIcons({ nodes: [document.getElementById('saveBtn')] });
}

function fillEditForm(id) {
  const record = records.find((item) => item.id === id);
  if (!record) return;

  document.getElementById('recordId').value       = record.id;
  document.getElementById('employeeId').value      = record.employeeId;
  document.getElementById('age').value             = record.age;
  document.getElementById('name').value            = record.name;
  document.getElementById('department').value      = record.department;
  document.getElementById('salary').value          = record.salary;
  document.getElementById('contactNo').value       = record.contactNo;
  document.getElementById('address').value         = record.address;
  document.getElementById('saveBtn').innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Update Record';
  lucide.createIcons({ nodes: [document.getElementById('saveBtn')] });

  // Scroll to form on mobile
  document.getElementById('recordForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Editing record — make changes and click Update.', 'info');
}

async function handleRecordSubmit(event) {
  event.preventDefault();

  const recordId = document.getElementById('recordId').value;
  const payload = {
    employeeId: document.getElementById('employeeId').value.trim(),
    age:        Number(document.getElementById('age').value),
    name:       document.getElementById('name').value.trim(),
    department: document.getElementById('department').value.trim(),
    salary:     Number(document.getElementById('salary').value),
    contactNo:  document.getElementById('contactNo').value.trim(),
    address:    document.getElementById('address').value.trim(),
  };

  if (!payload.employeeId || !payload.name || !payload.department) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (recordId) payload.id = recordId;

  try {
    await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    resetForm();
    await loadRecords();
    await loadAttendance();
    showToast(recordId ? 'Record updated successfully!' : 'New employee record saved!', 'success');
  } catch (err) {
    showToast('Failed to save record. Try again.', 'error');
  }
}

async function deleteRecord(id) {
  if (currentRole !== 'admin') return;

  try {
    const response = await fetch(`/api/records/${id}`, { method: 'DELETE' });
    const data = await response.json();
    records = data.records;
    await loadAttendance();
    renderRecords();
    renderStats();
    renderCharts();
    showToast('Employee record deleted.', 'info');
  } catch (err) {
    showToast('Failed to delete record.', 'error');
  }
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  ATTENDANCE                                              ║
// ╚═══════════════════════════════════════════════════════════╝
function renderAttendance() {
  attendanceEmployeeSelect.innerHTML = '';
  records.forEach((record) => {
    const option = document.createElement('option');
    option.value = record.id;
    option.textContent = `${record.employeeId} — ${record.name}`;
    attendanceEmployeeSelect.appendChild(option);
  });

  const rows = Object.entries(attendance).map(([id, entry]) => {
    const employee = records.find((r) => r.id === id);
    if (!employee) return null;

    const status    = typeof entry === 'string' ? entry : entry?.status || 'Unknown';
    const timestamp = typeof entry === 'string' ? ''    : entry?.timestamp || 'No timestamp';

    const statusBadge = {
      Present: `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Present</span>`,
      Absent:  `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/25">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>Absent</span>`,
      Late:    `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Late</span>`,
    };

    return `
      <tr class="row-animate hover:bg-white/[0.03] transition-colors duration-150">
        <td class="py-3.5 px-4 font-mono text-xs text-mnc-accentBright font-semibold">${employee.employeeId}</td>
        <td class="py-3.5 px-4 font-semibold text-mnc-text">${employee.name}</td>
        <td class="py-3.5 px-4">${statusBadge[status] || `<span class="text-mnc-muted">${status}</span>`}</td>
        <td class="py-3.5 px-4 font-mono text-xs text-mnc-sub">${timestamp}</td>
      </tr>
    `;
  }).filter(Boolean);

  attendanceTableBody.innerHTML = rows.join('');
}

async function markAttendance() {
  if (currentRole !== 'admin') return;

  const selectedId     = attendanceEmployeeSelect.value;
  const selectedStatus = attendanceStatusSelect.value;
  attendance[selectedId] = selectedStatus;

  try {
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: selectedId,
        status: selectedStatus,
        timestamp: new Date().toLocaleString(),
      }),
    });
    await loadAttendance();
    renderCharts();
    showToast(`Attendance marked as ${selectedStatus}.`, 'success');
  } catch (err) {
    showToast('Failed to mark attendance.', 'error');
  }
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  TAB NAVIGATION                                          ║
// ╚═══════════════════════════════════════════════════════════╝
function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Update button styles
      tabButtons.forEach((btn) => {
        btn.classList.remove('active', 'bg-gradient-to-r', 'from-mnc-accentDim', 'to-mnc-accent', 'text-white', 'shadow-lg', 'shadow-mnc-accentDim/30');
        btn.classList.add('text-mnc-muted');
      });
      button.classList.add('active', 'bg-gradient-to-r', 'from-mnc-accentDim', 'to-mnc-accent', 'text-white', 'shadow-lg', 'shadow-mnc-accentDim/30');
      button.classList.remove('text-mnc-muted');

      // Show/hide panels
      tabPanels.forEach((panel) => panel.classList.add('d-hidden'));
      const target = document.getElementById(button.dataset.tab);
      if (target) {
        target.classList.remove('d-hidden');
        // Re-trigger animation
        target.classList.remove('animate-fade-up');
        void target.offsetWidth; // reflow
        target.classList.add('animate-fade-up');
      }

      // Render charts when analytics tab is opened
      if (button.dataset.tab === 'analyticsTab') {
        setTimeout(renderCharts, 100);
      }
    });
  });
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  CHARTS (Chart.js)                                       ║
// ╚═══════════════════════════════════════════════════════════╝
const chartColors = {
  indigo:  { bg: 'rgba(99,102,241,0.7)',  border: '#818cf8'  },
  emerald: { bg: 'rgba(52,211,153,0.7)',  border: '#34d399'  },
  amber:   { bg: 'rgba(251,191,36,0.7)',  border: '#fbbf24'  },
  sky:     { bg: 'rgba(56,189,248,0.7)',   border: '#38bdf8'  },
  rose:    { bg: 'rgba(251,113,133,0.7)', border: '#fb7185'  },
  violet:  { bg: 'rgba(167,139,250,0.7)', border: '#a78bfa'  },
  teal:    { bg: 'rgba(45,212,191,0.7)',  border: '#2dd4bf'  },
  orange:  { bg: 'rgba(251,146,60,0.7)',  border: '#fb923c'  },
};
const paletteKeys = Object.keys(chartColors);

function getChartPalette(count) {
  const bgs = [], borders = [];
  for (let i = 0; i < count; i++) {
    const key = paletteKeys[i % paletteKeys.length];
    bgs.push(chartColors[key].bg);
    borders.push(chartColors[key].border);
  }
  return { bgs, borders };
}

function renderCharts() {
  renderDeptChart();
  renderSalaryChart();
  renderAttendanceDonut();
  renderAgeChart();
}

function renderDeptChart() {
  const canvas = document.getElementById('deptChart');
  if (!canvas) return;
  if (deptChartInstance) deptChartInstance.destroy();

  const deptMap = {};
  records.forEach((r) => { deptMap[r.department] = (deptMap[r.department] || 0) + 1; });
  const labels = Object.keys(deptMap);
  const data   = Object.values(deptMap);
  const { bgs, borders } = getChartPalette(labels.length);

  deptChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: bgs, borderColor: '#0a0e1a', borderWidth: 3, cutout: '72%' }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8, font: { size: 11 } } },
      },
    },
  });
}

function renderSalaryChart() {
  const canvas = document.getElementById('salaryChart');
  if (!canvas) return;
  if (salaryChartInstance) salaryChartInstance.destroy();

  const sorted = records.slice().sort((a, b) => b.salary - a.salary);
  const labels = sorted.map((r) => r.name);
  const data   = sorted.map((r) => r.salary);
  const { bgs } = getChartPalette(labels.length);

  salaryChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data, backgroundColor: bgs, borderRadius: 6, barThickness: 32,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(99,102,241,0.08)' }, ticks: { callback: (v) => `₹${(v/1000).toFixed(0)}K` } },
        y: { grid: { display: false } },
      },
    },
  });
}

function renderAttendanceDonut() {
  const canvas = document.getElementById('attendanceChart');
  if (!canvas) return;
  if (attendanceChartInstance) attendanceChartInstance.destroy();

  let present = 0, absent = 0, late = 0;
  Object.values(attendance).forEach((entry) => {
    const status = (typeof entry === 'string' ? entry : entry?.status || '').toLowerCase();
    if (status === 'present') present++;
    else if (status === 'absent') absent++;
    else if (status === 'late') late++;
  });

  if (present + absent + late === 0) {
    present = 1; // show something
  }

  attendanceChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Absent', 'Late'],
      datasets: [{
        data: [present, absent, late],
        backgroundColor: [chartColors.emerald.bg, chartColors.rose.bg, chartColors.amber.bg],
        borderColor: '#0a0e1a',
        borderWidth: 3,
        cutout: '72%',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8, font: { size: 11 } } },
      },
    },
  });
}

function renderAgeChart() {
  const canvas = document.getElementById('ageChart');
  if (!canvas) return;
  if (ageChartInstance) ageChartInstance.destroy();

  const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
  records.forEach((r) => {
    const a = r.age;
    if (a <= 25)      ageGroups['18-25']++;
    else if (a <= 35) ageGroups['26-35']++;
    else if (a <= 45) ageGroups['36-45']++;
    else if (a <= 55) ageGroups['46-55']++;
    else              ageGroups['56+']++;
  });

  const labels = Object.keys(ageGroups);
  const data   = Object.values(ageGroups);
  const { bgs, borders } = getChartPalette(labels.length);

  ageChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Employees',
        data,
        backgroundColor: bgs,
        borderColor: borders,
        borderWidth: 1,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(99,102,241,0.08)' }, beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}


// ╔═══════════════════════════════════════════════════════════╗
// ║  EVENT LISTENERS & INIT                                  ║
// ╚═══════════════════════════════════════════════════════════╝
searchInput.addEventListener('input', renderRecords);
recordForm.addEventListener('submit', handleRecordSubmit);
document.getElementById('resetBtn').addEventListener('click', resetForm);
markAttendanceBtn.addEventListener('click', markAttendance);

setupTabs();

// Apply active state to first tab
tabButtons[0]?.classList.add('bg-gradient-to-r', 'from-mnc-accentDim', 'to-mnc-accent', 'text-white', 'shadow-lg', 'shadow-mnc-accentDim/30');
tabButtons[0]?.classList.remove('text-mnc-muted');

// Initialize Lucide icons
lucide.createIcons();

// Load data
loadRecords();
loadAttendance();
