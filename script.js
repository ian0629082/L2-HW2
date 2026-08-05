/* ==========================================================================
   Ian Wang Portfolio - Core JavaScript Logic
   Includes: Dark/Light theme manager, Sticky navbar scroll animations,
             Mobile menu toggle, and Interactive parallax background glow effect.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const glow1 = document.getElementById('glow-1');
    const glow2 = document.getElementById('glow-2');

    /* --------------------------------------------------------------------------
       1. 深淺色主題切換 (Theme Toggle)
       -------------------------------------------------------------------------- */
    // 從 localStorage 讀取主題偏好，若無則預設為淺色模式
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
        
        // 切換主題時添加過渡特效
        document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    });

    /* --------------------------------------------------------------------------
       2. 導覽列滾動效果與頁面滾動監聽 (Navbar Scroll & Active States)
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // 導覽列縮減/毛玻璃加深
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 滾動時高亮對應的導覽列項目
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // 扣除 nav 高度加上緩衝
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* --------------------------------------------------------------------------
       3. 行動裝置選單切換 (Mobile Menu Toggle)
       -------------------------------------------------------------------------- */
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        
        // 切換按鈕圖示
        const toggleIcon = mobileMenuToggle.querySelector('i');
        if (isOpen) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // 點擊任何導覽項目後自動關閉行動選單
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileMenuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    /* --------------------------------------------------------------------------
       4. 作品集分頁籤切換 (Portfolio Tabs)
       -------------------------------------------------------------------------- */
    const portfolioTabBtns = document.querySelectorAll('.portfolio-tab-btn');
    const classroomGrid = document.getElementById('tab-classroom');
    const classroomPagination = document.getElementById('classroom-pagination');

    if (classroomGrid && classroomPagination) {
        const cards = Array.from(classroomGrid.querySelectorAll('.project-card'));
        const pageSize = 9;
        const pageCount = Math.ceil(cards.length / pageSize);

        const showPage = (page) => {
            cards.forEach((card, index) => {
                card.hidden = Math.floor(index / pageSize) + 1 !== page;
            });
            classroomPagination.querySelectorAll('.portfolio-page-btn').forEach(button => {
                const isCurrent = Number(button.dataset.page) === page;
                button.classList.toggle('active', isCurrent);
                button.setAttribute('aria-current', isCurrent ? 'page' : 'false');
            });
        };

        if (pageCount > 1) {
            for (let page = 1; page <= pageCount; page += 1) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'portfolio-page-btn';
                button.dataset.page = page;
                button.textContent = page;
                button.setAttribute('aria-label', `第 ${page} 頁`);
                button.addEventListener('click', () => showPage(page));
                classroomPagination.appendChild(button);
            }
            showPage(1);
        }
    }

    portfolioTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portfolioTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-tab');
            document.querySelectorAll('.portfolio-grid').forEach(grid => {
                grid.hidden = grid.id !== targetId;
            });
            if (classroomPagination) {
                classroomPagination.hidden = targetId !== 'tab-classroom';
            }
        });
    });

    /* --------------------------------------------------------------------------
       5. 鼠標動態背景光暈跟隨 (Wow Factor: Interactive Background Glow)
       -------------------------------------------------------------------------- */
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // 取得視窗寬高比例，計算偏移值
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const moveX1 = (mouseX - windowWidth / 2) * 0.04;
        const moveY1 = (mouseY - windowHeight / 2) * 0.04;
        const moveX2 = (mouseX - windowWidth / 2) * -0.03;
        const moveY2 = (mouseY - windowHeight / 2) * -0.03;

        // 微調背景發光球體的位置
        if (glow1) {
            glow1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
        }
        if (glow2) {
            glow2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
        }
    });
});
