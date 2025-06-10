import { NavLink } from 'react-router-dom';
import '../styles/NavigationControls.css';
import {useAuth} from "../context/AuthContext.jsx";
import UserSearch from "./pages/Message/UserSearch.jsx";

const NavigationControls = () => {
        const { user } = useAuth();

        return (
            <nav className="navigation-controls">
                    <NavLink
                        to="/home"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                            Главная
                    </NavLink>

                    <NavLink
                        to="/subscriptions"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                            Подписки
                    </NavLink>

                    {user && (
                        <NavLink
                            to={`/profile/${user.id}`}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                                Профиль
                        </NavLink>
                    )}

                    <NavLink
                        to="/chats"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                            Чаты
                    </NavLink>
                <div className="header-search">
                    <UserSearch />
                </div>
            </nav>

        );
};

export default NavigationControls;
