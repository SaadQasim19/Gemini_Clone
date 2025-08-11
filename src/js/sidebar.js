
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle sidebar visibility
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Handle navigation actions
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const action = item.dataset.action;
            handleNavigation(action);
        });
    });
     function handleNavigation(action) {
        switch (action) {
            case 'new-chat':
                // Logic for starting a new chat
                break;
            case 'history':
                // Logic for displaying chat history
                break;
            case 'recent':
                // Logic for displaying recent chats
                break;
            case 'settings':
                // Logic for displaying settings
                break;
            default:
                break;
        }
    }
});