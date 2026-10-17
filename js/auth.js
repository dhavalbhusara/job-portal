/**
 * JobUdaan - Client-Side Authentication (js/auth.js)
 * Supports:
 * - Super Admin (admin@careersetu.com)
 * - Personal MCQ Editor 1: Dhaval (dhaval@careersetu.com)
 * - Personal MCQ Editor 2: Tushar (tushar@careersetu.com)
 * - Candidate Demo & Google 1-Click Login
 * - LocalStorage session management
 */

const PREDEFINED_ACCOUNTS = {
  "admin@careersetu.com": {
    email: "admin@careersetu.com",
    name: "Super Administrator",
    role: "ADMIN",
    password: "123456",
    redirectUrl: "admin.html"
  },
  "dhaval@careersetu.com": {
    email: "dhaval@careersetu.com",
    name: "Dhaval (MCQ Specialist)",
    role: "MCQ_EDITOR",
    password: "123456",
    redirectUrl: "admin.html?tab=mcq"
  },
  "tushar@careersetu.com": {
    email: "tushar@careersetu.com",
    name: "Tushar (MCQ Specialist)",
    role: "MCQ_EDITOR",
    password: "123456",
    redirectUrl: "admin.html?tab=mcq"
  },
  "candidate@jobudaan.in": {
    email: "candidate@jobudaan.in",
    name: "Aakash Sharma",
    role: "CANDIDATE",
    password: "123456",
    redirectUrl: "index.html"
  }
};

const AuthService = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem("jobudaan_current_user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("jobudaan_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jobudaan_current_user");
    }
  },

  login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    
    // Check predefined
    if (PREDEFINED_ACCOUNTS[cleanEmail]) {
      const acc = PREDEFINED_ACCOUNTS[cleanEmail];
      if (acc.password === password) {
        const userObj = {
          name: acc.name,
          email: acc.email,
          role: acc.role,
          state: "Gujarat"
        };
        this.setCurrentUser(userObj);
        return { success: true, user: userObj, redirectUrl: acc.redirectUrl };
      } else {
        return { success: false, error: "ખોટો પાસવર્ડ છે. Please check password." };
      }
    }

    // Check custom registered users
    const registeredUsers = JSON.parse(localStorage.getItem("jobudaan_registered_users") || "[]");
    const found = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.password === password) {
        const userObj = { ...found, role: "CANDIDATE" };
        this.setCurrentUser(userObj);
        return { success: true, user: userObj, redirectUrl: "index.html" };
      } else {
        return { success: false, error: "ખોટો પાસવર્ડ છે." };
      }
    }

    return { success: false, error: "આ ઈમેઈલથી કોઈ એકાઉન્ટ મળ્યું નથી." };
  },

  loginWithGoogle() {
    const googleUser = {
      name: "Google Verified Candidate",
      email: "google.user@jobudaan.in",
      role: "CANDIDATE",
      state: "Gujarat"
    };
    this.setCurrentUser(googleUser);
    return { success: true, user: googleUser, redirectUrl: "index.html" };
  },

  register(userData) {
    const users = JSON.parse(localStorage.getItem("jobudaan_registered_users") || "[]");
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: "આ ઈમેઈલ પહેલેથી રજિસ્ટર્ડ છે." };
    }
    users.push(userData);
    localStorage.setItem("jobudaan_registered_users", JSON.stringify(users));

    const userObj = { ...userData, role: "CANDIDATE" };
    this.setCurrentUser(userObj);
    return { success: true, user: userObj, redirectUrl: "index.html" };
  },

  logout() {
    this.setCurrentUser(null);
    window.location.href = "index.html";
  }
};
