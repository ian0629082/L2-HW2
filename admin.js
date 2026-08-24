(() => {
    const config = window.SUPABASE_CONFIG;
    const client = window.supabase.createClient(config.url, config.publishableKey);
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const dashboardMessage = document.getElementById('dashboard-message');
    const numberFormat = new Intl.NumberFormat('zh-TW');

    function showLogin(message = '') {
        dashboardView.hidden = true;
        loginView.hidden = false;
        loginMessage.textContent = message;
    }

    function showDashboard() {
        loginView.hidden = true;
        dashboardView.hidden = false;
    }

    function displayNumber(id, value) {
        document.getElementById(id).textContent = numberFormat.format(value ?? 0);
    }

    function categoryLabel(category) {
        return category === 'project' ? '專案作品' : '課堂實作';
    }

    async function loadDashboard() {
        dashboardMessage.textContent = '';
        const [overviewResult, projectsResult] = await Promise.all([
            client.rpc('get_analytics_overview'),
            client.rpc('get_project_click_stats')
        ]);

        if (overviewResult.error || projectsResult.error) {
            await client.auth.signOut();
            showLogin('你沒有查看統計資料的權限。');
            return;
        }

        const overview = overviewResult.data?.[0] || {};
        displayNumber('today-visitors', overview.today_unique_visitors);
        displayNumber('total-visitors', overview.total_unique_visitors);
        displayNumber('today-clicks', overview.today_project_clicks);
        displayNumber('total-clicks', overview.total_project_clicks);

        const tbody = document.getElementById('project-stats');
        tbody.replaceChildren();
        projectsResult.data.forEach((project) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${project.project_title}</td><td><span class="category ${project.project_category}">${categoryLabel(project.project_category)}</span></td><td>${numberFormat.format(project.today_clicks)}</td><td class="total-cell">${numberFormat.format(project.total_clicks)}</td>`;
            tbody.appendChild(row);
        });

        document.getElementById('updated-at').textContent = `最後更新：${new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Taipei' }).format(new Date())}（台北時間）`;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = document.getElementById('login-button');
        button.disabled = true;
        loginMessage.textContent = '';
        const { error } = await client.auth.signInWithPassword({
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        });
        button.disabled = false;
        if (error) {
            loginMessage.textContent = 'Email 或密碼不正確，請再試一次。';
            return;
        }
        showDashboard();
        await loadDashboard();
    });

    document.getElementById('logout-button').addEventListener('click', async () => {
        await client.auth.signOut();
        showLogin();
    });
    document.getElementById('refresh-button').addEventListener('click', loadDashboard);

    client.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
            showDashboard();
            await loadDashboard();
        }
    });
})();
