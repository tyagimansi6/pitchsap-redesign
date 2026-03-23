document.addEventListener('DOMContentLoaded', () => {
  // --- Helpers ---
  const $ = (id) => document.getElementById(id);
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => document.querySelectorAll(sel);

  // --- Mobile Menu Toggle ---
  const mobileMenuToggle = qs('.mobile-menu-toggle');
  const mobileNav = qs('.mobile-nav');

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');

      const icon = mobileMenuToggle.querySelector('i');
      if (!icon) return;

      if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // --- Authentication Flow ---
  const authBtn = $('auth-btn');
  const authModal = $('auth-modal');
  const closeModalBtns = qsa('.close-modal');
  const loginForm = $('login-form');
  const chatContainer = $('chat-container');
  const chatWindow = $('chat-window');
  const chatMessages = $('chat-messages');
  const chatBadge = $('chat-badge');

  let isLoggedIn = false;

  // Open / Logout
  if (authBtn && authModal) {
    authBtn.addEventListener('click', () => {
      if (isLoggedIn) {
        isLoggedIn = false;

        authBtn.textContent = 'Login / Signup';
        authBtn.classList.remove('btn-secondary');
        authBtn.classList.add('btn-primary');

        if (chatContainer) chatContainer.classList.add('hidden');
        if (chatWindow) chatWindow.classList.remove('open');

        if (chatMessages) {
          chatMessages.innerHTML = `
            <div class="message received" style="animation: messagePopIn 0.3s ease;">
              <div class="msg-content">
                Welcome back to pitchSap! I'm your AI assistant.
              </div>
              <div class="msg-time">Just now</div>
            </div>
          `;
        }

        alert('You have logged out.');
      } else {
        authModal.classList.add('active');
      }
    });
  }

  // Close modal buttons
  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (authModal) authModal.classList.remove('active');
    });
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
    }
  });

  // Login Submit
  if (loginForm && authModal && authBtn) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = loginForm.querySelector('button');
      if (!btn) return;

      const originalText = btn.textContent;

      btn.textContent = 'Authenticating...';
      btn.disabled = true;

      setTimeout(() => {
        isLoggedIn = true;

        btn.textContent = originalText;
        btn.disabled = false;

        authModal.classList.remove('active');

        authBtn.textContent = 'Logout';
        authBtn.classList.remove('btn-primary');
        authBtn.classList.add('btn-secondary');

        if (chatContainer) chatContainer.classList.remove('hidden');

        loginForm.reset();

        if (chatBadge) chatBadge.style.display = 'flex';
      }, 800);
    });
  }

  // --- Chat functionality ---
  const chatToggle = $('chat-toggle');
  const closeChatBtn = $('close-chat');
  const chatInputForm = $('chat-input-form');
  const chatInput = $('chat-input');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('open');

      const badge = $('chat-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  if (closeChatBtn && chatWindow) {
    closeChatBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  // --- AI Reply Logic ---
  function determineReply(text) {
    if (
      text.includes('price') ||
      text.includes('pricing') ||
      text.includes('cost') ||
      text.includes('fee')
    ) {
      return "Our pricing is transparent with no hidden fees.";
    }

    if (
      text.includes('consultant') ||
      text.includes('expert') ||
      text.includes('talent')
    ) {
      return "We connect you with top-tier vetted experts globally.";
    }

    if (text.includes('how') || text.includes('process') || text.includes('work')) {
      return "You submit a request → we match experts → you start project within 48 hours.";
    }

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello! How can I help you today?";
    }

    if (text.includes('thank')) {
      return "You're welcome!";
    }

    const fallback = [
      "Can you elaborate that?",
      "Let me help you with that in detail.",
      "I can connect you with support for this."
    ];

    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  function appendMessage(text, type) {
    if (!chatMessages) return;

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.style.animation = 'messagePopIn 0.3s ease forwards';

    div.innerHTML = `
      <div class="msg-content">${text}</div>
      <div class="msg-time">${time}</div>
    `;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (!chatMessages) return null;

    const id = 'typing-' + Date.now();

    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = id;

    div.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;

    chatMessages.appendChild(div);
    return id;
  }

  function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Chat submit
  if (chatInputForm && chatInput) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const msg = chatInput.value.trim();
      if (!msg) return;

      appendMessage(msg, 'sent');
      chatInput.value = '';

      const typingId = showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator(typingId);
        const reply = determineReply(msg.toLowerCase());
        appendMessage(reply, 'received');
      }, 1000);
    });
  }
});