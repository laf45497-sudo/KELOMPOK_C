// ================= KONFIGURASI JSONBIN =================
const BIN_ID = "6ac4edcbac6210605a18fd33";
const API_KEY = "$2a$10$37Jn72Up0kXBn5bAAn.5zeUcsT1Y/nHuFxRjzuSuiR3JpytiQR1I6"; 
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Data awal cadangan (jika cloud masih kosong)
const DEFAULT_STUDENTS = [
  { id: 1, name: "Ahmad Rizky", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 2, name: "Siti Nurhaliza", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 3, name: "Budi Santoso", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 4, name: "Dewi Anggraini", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 5, name: "Eko Prasetyo", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 6, name: "Anisa Rahmawati", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 7, name: "Bayu Pratama", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 8, name: "Citra Lestari", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 9, name: "Deni Kurniawan", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 10, name: "Fifi Alawiyah", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 11, name: "Gilang Ramadan", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 12, name: "Indah Permata", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 13, name: "Joko Susilo", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 14, name: "Larasati Putri", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 15, name: "Muhammad Faisal", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 16, name: "Nadia Utami", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 17, name: "Reza Saputra", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 18, name: "Sania Marwah", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 19, name: "Taufik Hidayat", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 20, name: "Vina Panduwinata", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 21, name: "Wahyu Setiawan", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 22, name: "Yulia Ningsih", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 23, name: "Zidan Al-Farisi", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 24, name: "Zahra Maharani", gender: "P", status: "Belum", checkIn: "-", checkOut: "-", photo: null },
  { id: 25, name: "Rian Ardianto", gender: "L", status: "Belum", checkIn: "-", checkOut: "-", photo: null }
];

let appUsers = [
  { username: "KELOMPOK C", password: "#C.Hebat", name: "Kelompok C" }
];

let students = [];
let activityLogs = [];
let activeFilter = "all";
let activeRecapType = "daily";

// ================= FUNGSI SINKRONISASI CLOUD =================
async function loadCloudData() {
  try {
    const res = await fetch(`${BASE_URL}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const result = await res.json();
    const data = result.record;

    if (data.users && data.users.length > 0) {
      appUsers = data.users;
    }

    if (data.students && data.students.length > 0) {
      students = data.students;
    } else {
      students = DEFAULT_STUDENTS;
      await saveCloudData();
    }

    renderStudents();
  } catch (error) {
    console.error("Gagal sinkron data dari cloud:", error);
    students = DEFAULT_STUDENTS;
    renderStudents();
  }
}

async function saveCloudData() {
  const payload = {
    users: appUsers,
    students: students
  };

  try {
    await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Gagal menyimpan pembaruan ke cloud:", error);
  }
}

// ================= AUTENTIKASI (LOGIN & REGISTER) =================
function checkLoginStatus() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const loggedInUser = sessionStorage.getItem("currentUser") || "Petugas";
  const loginModal = document.getElementById("login-modal");
  const logoutBtn = document.getElementById("logout-btn");
  const userDisplay = document.getElementById("current-user-display");

  if (isLoggedIn === "true") {
    if (loginModal) loginModal.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (userDisplay) userDisplay.textContent = `Login: ${loggedInUser}`;
  } else {
    if (loginModal) loginModal.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (userDisplay) userDisplay.textContent = "";
  }
}

function initAuth() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  const tabLogin = document.getElementById("tab-login-btn");
  const tabRegister = document.getElementById("tab-register-btn");

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener("click", () => {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      tabLogin.className = "w-1/2 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600";
      tabRegister.className = "w-1/2 py-2 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-600";
    });

    tabRegister.addEventListener("click", () => {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
      tabRegister.className = "w-1/2 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600";
      tabLogin.className = "w-1/2 py-2 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-600";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("username-input").value.trim();
      const pass = document.getElementById("password-input").value.trim();
      const errorMsg = document.getElementById("login-error");

      const foundUser = appUsers.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === pass);

      if (foundUser) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("currentUser", foundUser.name || foundUser.username);
        errorMsg.classList.add("hidden");
        document.getElementById("username-input").value = "";
        document.getElementById("password-input").value = "";
        checkLoginStatus();
        addLog(`Login berhasil: ${foundUser.name || foundUser.username}`);
      } else {
        errorMsg.classList.remove("hidden");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-fullname").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const regMsg = document.getElementById("register-msg");

      const isExist = appUsers.some(u => u.username.toLowerCase() === username.toLowerCase());

      if (isExist) {
        regMsg.textContent = "Username sudah digunakan!";
        regMsg.className = "text-xs text-center text-red-500 block font-medium";
        return;
      }

      appUsers.push({ username, password, name });
      await saveCloudData();

      regMsg.textContent = "Pendaftaran berhasil disimpan ke cloud!";
      regMsg.className = "text-xs text-center text-green-600 block font-medium";

      setTimeout(() => {
        registerForm.reset();
        regMsg.classList.add("hidden");
        tabLogin.click();
        document.getElementById("username-input").value = username;
      }, 1000);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("currentUser");
      checkLoginStatus();
    });
  }
}

// ================= WAKTU & TANGGAL =================
function updateDateTime() {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");

  if (dateEl) dateEl.textContent = now.toLocaleDateString("id-ID", dateOptions);
  if (timeEl) timeEl.textContent = now.toLocaleTimeString("id-ID");
}

// ================= MANAJEMEN SISWA (TAMBAH & HAPUS) =================
function initStudentManagement() {
  const addStudentForm = document.getElementById("add-student-form");

  if (addStudentForm) {
    addStudentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("new-student-name");
      const genderInput = document.getElementById("new-student-gender");

      const name = nameInput.value.trim();
      const gender = genderInput.value;

      if (!name) return;

      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const newStudent = {
        id: newId,
        name: name,
        gender: gender,
        status: "Belum",
        checkIn: "-",
        checkOut: "-",
        photo: null
      };

      students.push(newStudent);
      renderStudents();
      await saveCloudData();
      addLog(`Siswa ditambahkan: ${name}`);

      nameInput.value = "";
    });
  }
}

async function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  const confirmDelete = confirm(`Hapus siswa "${student.name}"?`);
  if (confirmDelete) {
    students = students.filter(s => s.id !== id);
    renderStudents();
    await saveCloudData();
    addLog(`Siswa dihapus: ${student.name}`);
  }
}

// ================= RENDER TAMPILAN SISWA =================
function renderStudents(filter = activeFilter) {
  activeFilter = filter;
  const studentList = document.getElementById("student-list");
  if (!studentList) return;

  studentList.innerHTML = "";
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  const filtered = students.filter(student => {
    const matchFilter = filter === "all" || 
                        (filter === "male" && student.gender === "L") || 
                        (filter === "female" && student.gender === "P");
    const matchSearch = student.name.toLowerCase().includes(searchTerm);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    studentList.innerHTML = `<div class="p-6 text-center text-gray-400 text-sm">Tidak ada data siswa ditemukan.</div>`;
    updateCounters();
    return;
  }

  filtered.forEach(student => {
    const card = document.createElement("div");
    card.className = "p-3 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3";
    
    const avatar = `<div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">${student.name.charAt(0)}</div>`;

    let statusBadge = "";
    if (student.status === "Hadir") statusBadge = '<span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Hadir</span>';
    else if (student.status === "Sakit") statusBadge = '<span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">Sakit</span>';
    else if (student.status === "Izin") statusBadge = '<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">Izin</span>';
    else if (student.status === "Alpa") statusBadge = '<span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">Alpa</span>';
    else statusBadge = '<span class="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">Belum Absen</span>';

    card.innerHTML = `
      <div class="flex items-center gap-3 w-full sm:w-auto">
        ${avatar}
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-gray-800 text-sm">${student.name}</h4>
            <span class="text-xs text-gray-400 font-medium">(${student.gender === 'L' ? 'L' : 'P'})</span>
            ${statusBadge}
          </div>
          <p class="text-xs text-gray-500">Masuk: ${student.checkIn} | Pulang: ${student.checkOut}</p>
        </div>
      </div>
      
      <div class="flex gap-1 w-full sm:w-auto justify-end flex-wrap items-center">
        <button onclick="setStatus(${student.id}, 'Hadir')" class="px-2.5 py-1 text-xs font-semibold rounded bg-green-500 hover:bg-green-600 text-white">Hadir</button>
        <button onclick="setStatus(${student.id}, 'Sakit')" class="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-500 hover:bg-indigo-600 text-white">Sakit</button>
        <button onclick="setStatus(${student.id}, 'Izin')" class="px-2.5 py-1 text-xs font-semibold rounded bg-yellow-500 hover:bg-yellow-600 text-white">Izin</button>
        <button onclick="setStatus(${student.id}, 'Alpa')" class="px-2.5 py-1 text-xs font-semibold rounded bg-red-500 hover:bg-red-600 text-white">Alpa</button>
        <button onclick="checkOutStudent(${student.id})" class="px-2.5 py-1 text-xs font-semibold rounded bg-purple-500 hover:bg-purple-600 text-white">Pulang</button>
        <button onclick="deleteStudent(${student.id})" title="Hapus Siswa" class="px-2 py-1 text-xs font-semibold rounded bg-gray-100 hover:bg-red-100 text-red-600 ml-1 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    studentList.appendChild(card);
  });

  updateCounters();
}

async function setStatus(id, newStatus) {
  const student = students.find(s => s.id === id);
  if (student) {
    const timeNow = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    student.status = newStatus;
    if (newStatus === "Hadir" && student.checkIn === "-") {
      student.checkIn = timeNow;
    }
    renderStudents();
    await saveCloudData();
    addLog(`${student.name}: ${newStatus}`);
  }
}

async function checkOutStudent(id) {
  const student = students.find(s => s.id === id);
  if (student && student.status === "Hadir") {
    student.checkOut = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    renderStudents();
    await saveCloudData();
    addLog(`${student.name} pulang`);
  } else {
    alert("Siswa harus hadir terlebih dahulu sebelum pulang!");
  }
}

// ================= LOG AKTIVITAS & STATISTIK =================
function addLog(text) {
  const time = new Date().toLocaleTimeString("id-ID");
  activityLogs.unshift(`[${time}] ${text}`);
  renderActivityLog();
}

function renderActivityLog() {
  const logContainer = document.getElementById("activity-log");
  if (!logContainer) return;
  logContainer.innerHTML = activityLogs.map(log => `<div class="p-1.5 border-b border-gray-100 text-xs">${log}</div>`).join("");
}

function updateCounters() {
  const total = students.length || 1;
  const hadir = students.filter(s => s.status === "Hadir").length;
  const alpa = students.filter(s => s.status === "Alpa").length;
  const izin = students.filter(s => s.status === "Izin").length;
  const sakit = students.filter(s => s.status === "Sakit").length;
  const pulangs = students.filter(s => s.checkOut !== "-").length;

  document.getElementById("present-count").textContent = hadir;
  document.getElementById("absent-count").textContent = alpa;
  document.getElementById("permission-count").textContent = izin;
  document.getElementById("sick-count").textContent = sakit;

  document.getElementById("present-percent").textContent = `${Math.round((hadir / total) * 100)}%`;
  document.getElementById("absent-percent").textContent = `${Math.round((alpa / total) * 100)}%`;
  document.getElementById("permission-percent").textContent = `${Math.round((izin / total) * 100)}%`;
  document.getElementById("sick-percent").textContent = `${Math.round((sakit / total) * 100)}%`;

  document.getElementById("present-bar").style.width = `${(hadir / total) * 100}%`;
  document.getElementById("absent-bar").style.width = `${(alpa / total) * 100}%`;
  document.getElementById("permission-bar").style.width = `${(izin / total) * 100}%`;
  document.getElementById("sick-bar").style.width = `${(sakit / total) * 100}%`;

  document.getElementById("checkin-count").textContent = `${hadir} siswa`;
  document.getElementById("checkout-count").textContent = `${pulangs} siswa`;
  document.getElementById("inschool-count").textContent = `${Math.max(0, hadir - pulangs)} siswa`;
}

// ================= REKAP & EXPORT =================
function initializeRecapFeature() {
  const generateBtn = document.getElementById("generate-recap-btn");
  const recapTabs = document.querySelectorAll("#recap-tabs button");

  recapTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      recapTabs.forEach(t => t.classList.remove("active", "text-blue-600", "border-b-2", "border-blue-600"));
      e.target.classList.add("active", "text-blue-600", "border-b-2", "border-blue-600");
      activeRecapType = e.target.dataset.recap;
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const datePicker = document.getElementById("recap-date-picker");
      if (!datePicker.value) {
        alert("Pilih tanggal terlebih dahulu!");
        return;
      }

      const recapTitle = document.getElementById("recap-title");
      const recapContent = document.getElementById("recap-content");

      recapTitle.textContent = `Rekap ${activeRecapType.toUpperCase()} - ${datePicker.value}`;
      
      let html = `<table class="w-full text-left text-xs border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-1">Nama</th>
            <th class="border p-1">Hadir</th>
            <th class="border p-1">Sakit</th>
            <th class="border p-1">Izin</th>
            <th class="border p-1">Alpa</th>
          </tr>
        </thead>
        <tbody>`;

      students.forEach(s => {
        html += `<tr>
          <td class="border p-1">${s.name}</td>
          <td class="border p-1">${s.status === 'Hadir' ? 1 : 0}</td>
          <td class="border p-1">${s.status === 'Sakit' ? 1 : 0}</td>
          <td class="border p-1">${s.status === 'Izin' ? 1 : 0}</td>
          <td class="border p-1">${s.status === 'Alpa' ? 1 : 0}</td>
        </tr>`;
      });

      html += `</tbody></table>`;
      recapContent.innerHTML = html;
    });
  }
}

function exportExcel() {
  const data = students.map((s, i) => ({
    "No": i + 1,
    "Nama Siswa": s.name,
    "Jenis Kelamin": s.gender === "L" ? "Laki-Laki" : "Perempuan",
    "Status Absensi": s.status,
    "Jam Masuk": s.checkIn,
    "Jam Pulang": s.checkOut
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Absensi Siswa");
  XLSX.writeFile(wb, `Absensi_SMKN1KP_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Laporan Absensi Siswa SMKN 1 KUALA PEMBUANG", 14, 15);
  doc.setFontSize(10);
  doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 22);

  const tableData = students.map((s, i) => [
    i + 1, s.name, s.gender === "L" ? "Laki-Laki" : "Perempuan", s.status, s.checkIn, s.checkOut
  ]);

  doc.autoTable({
    startY: 28,
    head: [['No', 'Nama Siswa', 'Gender', 'Status', 'Masuk', 'Pulang']],
    body: tableData,
  });

  doc.save(`Absensi_SMKN1KP_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ================= EVENT LISTENER UTAMA =================
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  initAuth();
  initStudentManagement();

  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Muat data langsung dari cloud JSONBin
  loadCloudData();
  initializeRecapFeature();

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderStudents());
  }

  const excelBtn = document.getElementById("download-excel");
  const pdfBtn = document.getElementById("download-pdf");

  if (excelBtn) excelBtn.addEventListener("click", exportExcel);
  if (pdfBtn) pdfBtn.addEventListener("click", exportPDF);

  const tabBtns = document.querySelectorAll("#student-list-tabs .tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      tabBtns.forEach(b => b.classList.remove("active", "border-b-2", "border-blue-600", "text-blue-600"));
      e.target.classList.add("active", "border-b-2", "border-blue-600", "text-blue-600");
      renderStudents(e.target.dataset.filter);
    });
  });
});