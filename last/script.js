document.addEventListener("DOMContentLoaded", () => {
  const userRegistry = [];

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTabBtn = document.getElementById("loginTabBtn");
  const signupTabBtn = document.getElementById("signupTabBtn");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");
  const logoutBtn = document.getElementById("logoutBtn");
  const authWrap = document.getElementById("authWrap");
  const securedWrap = document.getElementById("securedWrap");

  loginTabBtn.addEventListener("click", () => showTab("login"));
  signupTabBtn.addEventListener("click", () => showTab("signup"));
  switchToSignup.addEventListener("click", (e) => { e.preventDefault(); showTab("signup"); });
  switchToLogin.addEventListener("click", (e) => { e.preventDefault(); showTab("login"); });

  signupForm.addEventListener("submit", handleSignup);
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);

  function showTab(tab) {
    clearMessages();
    if (tab === "login") {
      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
      loginTabBtn.classList.add("active");
      loginTabBtn.setAttribute("aria-selected", "true");
      signupTabBtn.classList.remove("active");
      signupTabBtn.setAttribute("aria-selected", "false");
    } else {
      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
      signupTabBtn.classList.add("active");
      signupTabBtn.setAttribute("aria-selected", "true");
      loginTabBtn.classList.remove("active");
      loginTabBtn.setAttribute("aria-selected", "false");
    }
  }

  function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;
    const msgEl = document.getElementById("signupMsg");

    if (!name || !email || !password || !confirm) {
      showMsg(msgEl, "Please fill in all the fields 💕", "error");
      return;
    }

    if (password.length < 6) {
      showMsg(msgEl, "Password should be at least 6 characters.", "error");
      return;
    }

    if (password !== confirm) {
      showMsg(msgEl, "Passwords don't match, try again!", "error");
      return;
    }

    const userExists = userRegistry.some(u => u.email === email);
    if (userExists) {
      showMsg(msgEl, "An account with this email already exists.", "error");
      return;
    }

    userRegistry.push({ name, email, password });
    showMsg(msgEl, "Account created! Redirecting to sign in... ✨", "success");

    signupForm.reset();
    setTimeout(() => {
      showTab("login");
      clearMessages();
    }, 1500);
  }

  function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const msgEl = document.getElementById("loginMsg");

    if (!email || !password) {
      showMsg(msgEl, "Please enter your email and password.", "error");
      return;
    }

    const authenticatedUser = userRegistry.find(u => u.email === email && u.password === password);

    if (!authenticatedUser) {
      showMsg(msgEl, "Oops! Incorrect email or password.", "error");
      return;
    }

    showMsg(msgEl, "Login successful! Redirecting... 💖", "success");

    setTimeout(() => {
      authWrap.classList.add("hidden");
      securedWrap.classList.remove("hidden");
      document.getElementById("welcomeMsg").innerText = `Welcome back, ${authenticatedUser.name}! ✨`;
      loginForm.reset();
      clearMessages();
    }, 1000);
  }

  function handleLogout() {
    securedWrap.classList.add("hidden");
    authWrap.classList.remove("hidden");
    showTab("login");
  }

  function showMsg(element, text, type) {
    element.innerText = text;
    element.className = `msg ${type}`;
  }

  function clearMessages() {
    document.querySelectorAll(".msg").forEach(el => {
      el.innerText = "";
      el.className = "msg";
    });
  }
});