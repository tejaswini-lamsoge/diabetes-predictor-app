import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* Brand */}
            <div className="brand">

                <div className="brand-icon">
                    🩺
                </div>

                <div className="brand-text">
                    <h2>Diabetes AI</h2>
                    <span>Prediction Platform</span>
                </div>

            </div>


            {/* Main Navigation */}
            <nav className="navigation">

                <NavLink to="/" className="nav-item">
                    <span className="nav-icon">⌂</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/patients" className="nav-item">
                    <span className="nav-icon">♙</span>
                    <span>Patients</span>
                </NavLink>

                <NavLink to="/assessment" className="nav-item">
                    <span className="nav-icon">＋</span>
                    <span>Assessment</span>
                </NavLink>

                <NavLink to="/history" className="nav-item">
                    <span className="nav-icon">▣</span>
                    <span>Assessment History</span>
                </NavLink>

                <NavLink to="/reports" className="nav-item">
                    <span className="nav-icon">▤</span>
                    <span>Reports</span>
                </NavLink>

                <NavLink to="/analytics" className="nav-item">
                    <span className="nav-icon">▥</span>
                    <span>Analytics</span>
                </NavLink>

            </nav>


            {/* Bottom Navigation */}
            <div className="sidebar-bottom">

                <NavLink to="/settings" className="nav-item">
                    <span className="nav-icon">⚙</span>
                    <span>Settings</span>
                </NavLink>

                <NavLink to="/help" className="nav-item">
                    <span className="nav-icon">?</span>
                    <span>Help & Support</span>
                </NavLink>


                {/* User */}
                <div className="user-section">

                    <div className="user-avatar">
                        A
                    </div>

                    <div className="user-info">
                        <strong>Administrator</strong>
                        <span>Admin</span>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;