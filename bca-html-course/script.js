document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light Mode)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  // Set initial theme from localStorage
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  // Handle toggle click
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'light');
    }
  });

  // 2. Sidebar Navigation (Mobile Layout toggling)
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
  }

  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // On mobile, close sidebar after selecting an item
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // 3. ScrollSpy & Progress Tracking
  const sections = document.querySelectorAll('section[id], header[id]');
  const progressPercent = document.getElementById('progressPercent');
  const progressFill = document.getElementById('progressFill');

  function updateScrollProgressAndSpy() {
    // A. Dynamic Scroll Progress Fill
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

    if (progressPercent) progressPercent.textContent = `${scrollPercentage}%`;
    if (progressFill) progressFill.style.width = `${scrollPercentage}%`;

    // B. ScrollSpy - Find active section based on current scroll position
    let currentActiveId = '';
    const scrollBuffer = 120; // offset topbar + cushion
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - scrollBuffer) {
        currentActiveId = section.getAttribute('id');
      }
    });

    if (currentActiveId) {
      navItems.forEach(item => {
        // Match both href (e.g. #module1) and data-section="module1"
        const href = item.getAttribute('href');
        const dataSec = item.getAttribute('data-section');
        const matches = (href === `#${currentActiveId}` || dataSec === currentActiveId);
        
        if (matches) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollProgressAndSpy);
  updateScrollProgressAndSpy(); // Trigger run on startup

  // 4. Back-to-Top Button Toggle & Scroll Functionality
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// 5. Global Clipboard Code Copy Utility
// Placed globally because copy buttons have inline `onclick="copyCode(this)"`
window.copyCode = function(button) {
  const codeBlock = button.closest('.code-block');
  if (!codeBlock) return;
  const codeElement = codeBlock.querySelector('code');
  if (!codeElement) return;

  const textToCopy = codeElement.innerText;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Successfully copied
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.disabled = false;
    }, 2000);
  }).catch(err => {
    console.error('Could not copy code snippet: ', err);
  });
};

// 6. PDF Export Functionality
document.addEventListener('DOMContentLoaded', () => {
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  if (!downloadPdfBtn) return;

  downloadPdfBtn.addEventListener('click', () => {
    document.body.classList.add('printing-pdf');
    window.print();
  });
});
