/**
 * 超市货物仓库管理系统 - 认证模块
 */

const Auth = (function () {
    // ========== 登录页逻辑 ==========

    function initLoginPage() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        const errorEl = document.getElementById('loginError');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const roleRadio = document.querySelector('input[name="role"]:checked');
            const role = roleRadio ? roleRadio.value : 'admin';

            if (!username || !password) {
                errorEl.textContent = '请输入用户名和密码';
                return;
            }

            const user = DB.authenticate(username, password);

            if (!user) {
                errorEl.textContent = '用户名或密码错误';
                return;
            }

            if (user.role !== role) {
                errorEl.textContent = '该用户不属于所选角色，请重新选择身份';
                return;
            }

            // 登录成功
            errorEl.textContent = '';
            sessionStorage.setItem(DB.KEYS.currentUser, JSON.stringify(user));
            window.location.href = 'dashboard.html';
        });
    }

    // ========== 鉴权检查 ==========

    function getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem(DB.KEYS.currentUser));
        } catch (e) {
            return null;
        }
    }

    function requireAuth() {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return null;
        }
        return user;
    }

    function isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    }

    function logout() {
        sessionStorage.removeItem(DB.KEYS.currentUser);
        window.location.href = 'index.html';
    }

    // 自动初始化
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }

    return {
        getCurrentUser,
        requireAuth,
        isAdmin,
        logout,
    };
})();
