(() => {
    const config = window.SUPABASE_CONFIG;
    if (!config || !window.supabase) return;

    const client = window.supabase.createClient(config.url, config.publishableKey);
    const storageKey = 'portfolio_analytics_visitor_id';

    function visitorId() {
        let id = localStorage.getItem(storageKey);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(storageKey, id);
        }
        return id;
    }

    async function recordDailyVisit() {
        await client.rpc('record_daily_visit', { p_visitor_id: visitorId() });
    }

    async function recordProjectClick(projectId) {
        await client.rpc('record_project_click', {
            p_visitor_id: visitorId(),
            p_project_id: projectId
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        void recordDailyVisit();

        document.querySelectorAll('.project-preview[data-project-id]').forEach((link) => {
            link.addEventListener('click', () => {
                void recordProjectClick(link.dataset.projectId);
            });
        });
    });
})();
