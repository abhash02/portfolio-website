import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_ootr4iy';
const TEMPLATE_ID = 'template_t4yf0qw';
const PUBLIC_KEY = 'Bo1bEFLGyO4Iu50Hp';

// Initialize EmailJS Browser SDK
emailjs.init({
  publicKey: PUBLIC_KEY,
});

/**
 * Toast Notification System
 * Creates glassmorphic dark toasts matching the website design aesthetic.
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const icon = iconMap[type] || iconMap.info;

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  const removeToast = () => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  };

  const timer = setTimeout(removeToast, 5000);

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });
  }
}

/**
 * Email Regex Validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Initialize Contact Form Listener
 */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!submitBtn) return;

  const btnText = submitBtn.querySelector('.btn-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Step 1: Validate all required fields
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all required fields.', 'warning');

      // Focus first empty input
      if (!name && nameInput) nameInput.focus();
      else if (!email && emailInput) emailInput.focus();
      else if (!subject && subjectInput) subjectInput.focus();
      else if (!message && messageInput) messageInput.focus();
      return;
    }

    // Step 2: Validate email format
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'warning');
      if (emailInput) emailInput.focus();
      return;
    }

    // Step 3 & 4: Disable button & change text to "Sending..."
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    if (btnText) {
      btnText.textContent = 'Sending...';
    }

    const templateParams = {
      name,
      email,
      subject,
      message,
    };

    try {
      // Step 5: Send email using EmailJS Browser SDK
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      if (response.status === 200 || response.text === 'OK') {
        // Step 6: On success
        showToast("Message sent successfully! I'll get back to you soon.", 'success');
        form.reset();
      } else {
        throw new Error(`Unexpected EmailJS response: ${response.status}`);
      }
    } catch (error) {
      // Step 7: On failure
      console.error('EmailJS submit error:', error);
      showToast('Failed to send message. Please try again later.', 'error');
    } finally {
      // Re-enable button and restore button text
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      if (btnText) {
        btnText.textContent = 'Send Message';
      }
    }
  });
}
