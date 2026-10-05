/* ==============================================================================
   BENGAL EXPLORERS — UNIVERSAL MOBILE BOTTOM NAVIGATION LOGIC
   Seamless Page Detection • Native Bottom Sheet • Web Share API
   ============================================================================== */

window.setActiveMobileNav = function(el) {
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');
};

window.toggleMobileQuickHubDrawer = function(open) {
    const overlay = document.getElementById('mobile-hub-drawer-overlay');
    const drawer = document.getElementById('mobile-hub-drawer');
    if (overlay && drawer) {
        if (open) {
            overlay.classList.add('open');
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.remove('open');
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
};

window.openMobileNavShare = function() {
    const pageTitle = document.title || 'Bengal Explorers';
    const pageUrl = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: pageTitle,
            text: 'Discover West Bengal with Bengal Explorers — Live transit radar, interactive GIS maps & travel guides!',
            url: pageUrl
        }).catch(() => {});
    } else {
        const text = encodeURIComponent('Explore Bengal with Bengal Explorers: ' + pageUrl);
        window.open('https://api.whatsapp.com/send?text=' + text, '_blank');
    }
};

// Automatic Active Page Detection & ESC Key Listener
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    
    // Highlight active nav item based on current page
    let activeId = 'mob-nav-explore';
    if (currentPath.includes('blog.html')) {
        activeId = 'mob-nav-blog';
    } else if (currentPath.includes('guide-')) {
        activeId = 'mob-nav-explore';
    } else if (
        currentPath.includes('about.html') ||
        currentPath.includes('contact.html') ||
        currentPath.includes('privacy.html') ||
        currentPath.includes('terms.html') ||
        currentPath.includes('disclaimer.html')
    ) {
        activeId = 'mob-nav-hub';
    } else if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath === '') {
        activeId = 'mob-nav-explore';
    }

    let targetNav = document.getElementById(activeId);
    if (!targetNav && (activeId === 'mob-nav-explore' || activeId === 'mob-nav-home')) {
        targetNav = document.getElementById('mob-nav-explore') || document.getElementById('mob-nav-home');
    }

    if (targetNav) {
        document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
        targetNav.classList.add('active');
    }

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMobileQuickHubDrawer(false);
        }
    });
});
