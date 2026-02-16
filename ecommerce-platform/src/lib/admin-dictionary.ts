export type AdminDictionary = {
    dashboard: string;
    reports: string;
    products: string;
    categories: string;
    stlModels: string;
    orders: string;
    discounts: string;
    questions: string;
    messages: string;
    contactSettings: string;
    customRequests: string;
    services: string;
    reviews: string;
    profile: string;
    backToSite: string;
    logout: string;
    // Profile Page
    generalInfo: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    security: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    sessionManagement: string;
    currentSession: string;
    logoutAll: string;
    preferences: string;
    theme: string;
    themeDesc: string;
    light: string;
    dark: string;
    language: string;
    languageDesc: string;
    recentActivity: string;
    date: string;
    action: string;
    target: string;
};

export const adminTranslations: Record<'TR' | 'EN', AdminDictionary> = {
    TR: {
        dashboard: 'Genel Bakış',
        reports: 'Satış Analizi',
        products: 'Ürünler',
        categories: 'Kategoriler',
        stlModels: 'STL Modeller',
        orders: 'Siparişler',
        discounts: 'İndirim Kuponları',
        questions: 'Sorular',
        messages: 'Mesajlar',
        contactSettings: 'İletişim Ayarları',
        customRequests: 'Özel Site Talepleri',
        services: 'Hizmet İçerik Yönetimi',
        reviews: 'Değerlendirmeler',
        profile: 'Profilim',
        backToSite: 'Siteye Dön',
        logout: 'Çıkış Yap',
        // Profile
        generalInfo: 'Genel Bilgiler',
        fullName: 'Ad Soyad',
        email: 'E-posta',
        role: 'Rol',
        status: 'Durum',
        lastLogin: 'Son Giriş',
        security: 'Güvenlik',
        currentPassword: 'Mevcut Şifre',
        newPassword: 'Yeni Şifre',
        confirmPassword: 'Yeni Şifre (Tekrar)',
        updatePassword: 'Şifreyi Güncelle',
        sessionManagement: 'Oturum Yönetimi',
        currentSession: 'Mevcut Oturum',
        logoutAll: 'Tüm Cihazlardan Çıkış Yap',
        preferences: 'Tercihler',
        theme: 'Tema',
        themeDesc: 'Arayüz görünümünü değiştirin.',
        light: 'Açık',
        dark: 'Koyu',
        language: 'Dil',
        languageDesc: 'Panel dilini değiştirin.',
        recentActivity: 'Son Aktiviteler',
        date: 'Tarih',
        action: 'İşlem',
        target: 'Hedef'
    },
    EN: {
        dashboard: 'Dashboard',
        reports: 'Sales Analysis',
        products: 'Products',
        categories: 'Categories',
        stlModels: 'STL Models',
        orders: 'Orders',
        discounts: 'Discounts',
        questions: 'Questions',
        messages: 'Messages',
        contactSettings: 'Contact Settings',
        customRequests: 'Custom Requests',
        services: 'Service Content',
        reviews: 'Reviews',
        profile: 'My Profile',
        backToSite: 'Back to Site',
        logout: 'Logout',
        // Profile
        generalInfo: 'General Information',
        fullName: 'Full Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        lastLogin: 'Last Login',
        security: 'Security',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        updatePassword: 'Update Password',
        sessionManagement: 'Session Management',
        currentSession: 'Current Session',
        logoutAll: 'Logout All Devices',
        preferences: 'Preferences',
        theme: 'Theme',
        themeDesc: 'Change interface appearance.',
        light: 'Light',
        dark: 'Dark',
        language: 'Language',
        languageDesc: 'Change panel language.',
        recentActivity: 'Recent Activity',
        date: 'Date',
        action: 'Action',
        target: 'Target'
    }
};
