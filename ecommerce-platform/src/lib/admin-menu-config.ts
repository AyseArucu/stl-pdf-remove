import { FaBox, FaList, FaShoppingCart, FaTags, FaQuestionCircle, FaStar, FaSignOutAlt, FaArrowLeft, FaEnvelope, FaMapMarkedAlt, FaChartLine, FaLaptopCode, FaCube, FaUserCircle, FaImage, FaVideo } from 'react-icons/fa';
import { PERMISSIONS } from './permission-constants';

export const ADMIN_MENU_ITEMS = [
    // { label: t.reports, href: '/erashu/admin/reports/sales', icon: <FaChartLine />, perm: PERMISSIONS.DASHBOARD_VIEW },

    // Core Modules
    { label: "3D Modeller (STL)", href: '/erashu/admin/stl-models', icon: FaCube, perm: PERMISSIONS.PRODUCTS_EDIT },
    { label: "Blog / Haberler", href: '/erashu/admin/blog', icon: FaEnvelope, perm: PERMISSIONS.BLOG_VIEW },

    // Dashboard & Messages
    { label: "Mesajlar", href: '/erashu/admin/messages', icon: FaEnvelope, perm: PERMISSIONS.DASHBOARD_VIEW },

    // Settings Group
    { label: "İletişim Ayarları", href: '/erashu/admin/contact-settings', icon: FaMapMarkedAlt, perm: PERMISSIONS.SETTINGS_VIEW },
    { label: "Slider Yönetimi", href: '/erashu/admin/slider', icon: FaChartLine, perm: PERMISSIONS.SETTINGS_VIEW },
    { label: "Hizmetler", href: '/erashu/admin/services/content', icon: FaLaptopCode, perm: PERMISSIONS.SETTINGS_VIEW },

    // Categories & Q&A
    { label: "Kategoriler", href: '/erashu/admin/categories', icon: FaList, perm: PERMISSIONS.PRODUCTS_EDIT },
    { label: "Sorular (Q&A)", href: '/erashu/admin/questions', icon: FaQuestionCircle, perm: PERMISSIONS.DASHBOARD_VIEW },

    // RBAC Management
    { label: "Rol Yönetimi", href: '/erashu/admin/roles', icon: FaUserCircle, perm: PERMISSIONS.ROLES_MANAGE },
    { label: "Personel", href: '/erashu/admin/staff', icon: FaUserCircle, perm: PERMISSIONS.STAFF_MANAGE },
    { label: "Reklam Yönetimi", href: '/erashu/admin/ads', icon: FaChartLine, perm: PERMISSIONS.SETTINGS_VIEW },

    // Tools
    { label: "Remove.AI", href: '/tools/background-remover', icon: FaImage, perm: PERMISSIONS.PRODUCTS_VIEW },

    // Profile (Always authorized)
    { label: "Profil", href: '/erashu/admin/profile', icon: FaUserCircle, perm: null },
];
