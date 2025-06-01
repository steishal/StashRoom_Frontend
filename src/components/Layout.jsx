import { Outlet } from 'react-router-dom';
import NavigationControls from "./NavigationControls.jsx";

const Layout = () => {
    return (
        <div className="app">
            <div className="main-layout">
                <NavigationControls />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
