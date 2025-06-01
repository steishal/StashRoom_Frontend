import { NavLink } from 'react-router-dom';
import '../styles/NavigationControls.css';
import {useAuth} from "../context/AuthContext.jsx";

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
                        to="/chat"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                            Чаты
                    </NavLink>
            </nav>
        );
};

export default NavigationControls;
