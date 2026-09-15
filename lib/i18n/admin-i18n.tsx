'use client';

import React, { createContext, useContext, useState } from 'react';

export type AdminLanguage = 'en' | 'ar';

export const adminTranslations = {
  en: {
    // Navigation & Layout
    brand: 'S7 LÉGENDES',
    portalSubtitle: 'ADMIN PORTAL',
    dashboard: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    boutique: 'Storefront',
    signOut: 'Sign Out',
    headerTitle: 'S7 Football Jersey Management',
    connectedAdmin: 'Admin Connected',
    langToggle: 'العربية',

    // Dashboard Overview
    overview: 'Store Overview & Real-time Metrics',
    addProduct: 'Add Jersey',
    totalProducts: 'Total Jerseys',
    activeProducts: 'Active jerseys in store',
    featuredProducts: 'Featured Jerseys',
    featuredDesc: 'Showcased on homepage carousel',
    totalCategories: 'Total Categories',
    categoriesDesc: 'Active collections in store',
    lowStock: 'Out of Stock',
    lowStockDesc: 'Sizes with exhausted inventory',
    recentJerseys: 'Latest Jerseys',
    viewAll: 'View all',
    noJerseysFound: 'No jerseys found.',

    // Table Headers & Values
    colJersey: 'Jersey',
    colPlayerYear: 'Player / Year',
    colPrice: 'Price',
    colCategory: 'Category',
    colSizes: 'Available Sizes',
    colStatus: 'Status',
    colAction: 'Actions',
    actionView: 'View in Store',
    actionEdit: 'Edit',
    actionDelete: 'Delete',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    statusSoldOut: 'Sold Out',
    confirmDelete: 'Are you sure you want to delete this jersey? This action cannot be undone.',

    // Products Page
    manageProducts: 'Jerseys Inventory',
    manageProductsSubtitle: 'Manage vintage football jerseys, sizes, stock, and photography',
    searchPlaceholder: 'Search jersey by name, player, team or year...',
    allCategories: 'All Categories',
    allStatus: 'All Statuses',
    onlyFeatured: 'Featured Only',
    totalCount: '{count} jerseys',

    // Product Form (Create & Edit)
    formNewTitle: 'Add New Jersey',
    formNewSubtitle: 'Create a vintage jersey with photos, sizes, condition and pricing',
    formEditTitle: 'Edit Jersey',
    formEditSubtitle: 'Update details, availability, sizes, and photography',
    backToJerseys: 'Back to jerseys',
    secGeneral: 'General Information',
    secClassification: 'Classification & Season',
    secPricing: 'Pricing & Status',
    secStock: 'Sizes & Inventory',
    secPhotos: 'Jersey Photography',
    secDetails: 'Description & Shipping',

    labelName: 'Jersey Name',
    labelSlug: 'URL Slug',
    labelPlayer: 'Player Name',
    labelTeam: 'Club / National Team',
    labelYear: 'Year / Season',
    labelCategory: 'Category',
    labelProductType: 'Product Type (Home, Away, Third, Retro...)',
    labelCondition: 'Condition (Mint, Excellent, Very Good...)',
    labelPrice: 'Price',
    labelFeatured: 'Feature on Homepage Carousel',
    labelActive: 'Active (Visible on Storefront)',
    labelDescription: 'Product Description',
    labelShipping: 'Shipping & Delivery Text',
    labelUploadPrompt: 'Click or drag images to upload',
    labelUploadInfo: 'Supports PNG, JPG, WebP. High resolution vintage photos recommended.',
    labelPrimaryBadge: 'PRIMARY',
    labelSetPrimary: 'Set as primary',
    labelSize: 'Size',
    labelStock: 'Stock',
    labelAvailable: 'Available for sale',

    btnSave: 'Save Jersey',
    btnCreate: 'Create Jersey',
    btnSaving: 'Saving...',
    btnCancel: 'Cancel',

    // Categories Page
    manageCategories: 'Categories & Collections',
    manageCategoriesSubtitle: 'Organize store collections (World Cup, UCL, Rare Archive, etc.)',
    addCategory: 'Add Category',
    quickCreateCategory: '+ Add New Category',
    createAndSelect: 'Create & Select',
    editCategory: 'Edit Category',
    catName: 'Category Name',
    catSlug: 'Category Slug',
    catDescription: 'Category Description',
    catActive: 'Active (Visible in Store)',
    btnSaveCategory: 'Save Category',
    btnCreateCategory: 'Create Category',
    confirmDeleteCat: 'Are you sure you want to delete this category?',

    // Login Page
    loginTitle: 'S7 LÉGENDES ADMIN',
    loginSubtitle: 'Sign in to access store inventory and management',
    loginEmail: 'Email Address',
    loginPassword: 'Password',
    loginSubmit: 'Sign In',
    loginLoading: 'Connecting...',
    loginError: 'Invalid credentials',
  },
  ar: {
    // Navigation & Layout
    brand: 'S7 LÉGENDES',
    portalSubtitle: 'بوابة الإدارة',
    dashboard: 'لوحة التحكم',
    products: 'القمصان',
    categories: 'الأقسام',
    boutique: 'واجهة المتجر',
    signOut: 'تسجيل الخروج',
    headerTitle: 'S7 LÉGENDES — إدارة قمصان كرة القدم',
    connectedAdmin: 'متصل كمسؤول',
    langToggle: 'English',

    // Dashboard Overview
    overview: 'نظرة عامة على المتجر والإحصائيات الفورية',
    addProduct: 'إضافة قميص',
    totalProducts: 'إجمالي القمصان',
    activeProducts: 'قمصان معروضة بالمتجر',
    featuredProducts: 'قمصان مميزة',
    featuredDesc: 'معروضة في الصفحة الرئيسية',
    totalCategories: 'إجمالي الأقسام',
    categoriesDesc: 'أقسام نشطة في المتجر',
    lowStock: 'نفاد المخزون',
    lowStockDesc: 'مقاسات نفدت كميتها تماماً',
    recentJerseys: 'أحدث القمصان المضافة',
    viewAll: 'عرض الكل',
    noJerseysFound: 'لم يتم العثور على قمصان.',

    // Table Headers & Values
    colJersey: 'القميص',
    colPlayerYear: 'اللاعب / السنة',
    colPrice: 'السعر',
    colCategory: 'القسم',
    colSizes: 'المقاسات المتوفرة',
    colStatus: 'الحالة',
    colAction: 'الإجراءات',
    actionView: 'معاينة بالمتجر',
    actionEdit: 'تعديل',
    actionDelete: 'حذف',
    statusActive: 'نشط',
    statusInactive: 'معطّل',
    statusSoldOut: 'نفد',
    confirmDelete: 'هل أنت متأكد من حذف هذا القميص؟ لا يمكن التراجع عن هذا الإجراء.',

    // Products Page
    manageProducts: 'إدارة مخزون القمصان',
    manageProductsSubtitle: 'التحكم في قمصان كرة القدم التاريخية والمقاسات والمخزون والصور',
    searchPlaceholder: 'ابحث باسم القميص أو اللاعب أو الفريق أو السنة...',
    allCategories: 'جميع الأقسام',
    allStatus: 'جميع الحالات',
    onlyFeatured: 'المميزة فقط',
    totalCount: '{count} قميص',

    // Product Form (Create & Edit)
    formNewTitle: 'إضافة قميص جديد',
    formNewSubtitle: 'إنشاء قميص كلاسيكي مع الصور والمقاسات والحالة والتسعير',
    formEditTitle: 'تعديل القميص',
    formEditSubtitle: 'تحديث التفاصيل والمقاسات والتسعير وصور القميص',
    backToJerseys: 'العودة إلى قائمة القمصان',
    secGeneral: 'المعلومات العامة',
    secClassification: 'التصنيف والموسم',
    secPricing: 'التسعير وحالة العرض',
    secStock: 'المقاسات والمخزون المتوفر',
    secPhotos: 'صور القميص',
    secDetails: 'الوصف والشحن',

    labelName: 'اسم القميص',
    labelSlug: 'الرابط المخصص (Slug)',
    labelPlayer: 'اسم اللاعب',
    labelTeam: 'النادي / المنتخب',
    labelYear: 'السنة / الموسم',
    labelCategory: 'القسم',
    labelProductType: 'نوع القميص (أساسي، احتياطي، ثالث، كلاسيكي...)',
    labelCondition: 'حالة القميص (ممتاز، جديد بالبطاقة، جيد جداً...)',
    labelPrice: 'السعر باليورو',
    labelFeatured: 'تثبيت في القائمة المميزة بالصفحة الرئيسية',
    labelActive: 'متاح للطلب والعرض في المتجر',
    labelDescription: 'وصف القميص وقصته',
    labelShipping: 'معلومات الشحن والتوصيل',
    labelUploadPrompt: 'انقر أو اسحب الصور هنا للرفع',
    labelUploadInfo: 'يدعم صيغ PNG, JPG, WebP. يفضل استخدام صور عالية الدقة.',
    labelPrimaryBadge: 'الصورة الرئيسية',
    labelSetPrimary: 'تعيين كرئيسية',
    labelSize: 'المقاس',
    labelStock: 'الكمية',
    labelAvailable: 'متاح للبيع',

    btnSave: 'حفظ التعديلات',
    btnCreate: 'إنشاء القميص',
    btnSaving: 'جاري الحفظ...',
    btnCancel: 'إلغاء',

    // Categories Page
    manageCategories: 'إدارة الأقسام والمجموعات',
    manageCategoriesSubtitle: 'تنظيم تشكيلات المتجر (كأس العالم، دوري الأبطال، نوادي كلاسيكية...)',
    addCategory: 'إضافة قسم جديد',
    quickCreateCategory: '+ إضافة قسم جديد',
    createAndSelect: 'إنشاء وتحديد',
    editCategory: 'تعديل القسم',
    catName: 'اسم القسم',
    catSlug: 'رابط القسم (Slug)',
    catDescription: 'وصف القسم',
    catActive: 'متاح في المتجر',
    btnSaveCategory: 'حفظ التعديلات',
    btnCreateCategory: 'إنشاء القسم',
    confirmDeleteCat: 'هل أنت متأكد من حذف هذا القسم؟',

    // Login Page
    loginTitle: 'S7 LÉGENDES ADMIN',
    loginSubtitle: 'سجل الدخول لإدارة الكتالوج والمخزون والمنتجات',
    loginEmail: 'البريد الإلكتروني',
    loginPassword: 'كلمة المرور',
    loginSubmit: 'تسجيل الدخول',
    loginLoading: 'جاري الاتصال...',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
};

export type AdminTranslationKey = keyof typeof adminTranslations.en;

interface AdminLanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  toggleLanguage: () => void;
  tAdmin: (key: AdminTranslationKey, params?: Record<string, string | number>) => string;
  isArabic: boolean;
}

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  tAdmin: (key) => key,
  isArabic: true,
});

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('s7_admin_lang') as AdminLanguage | null;
        if (saved === 'en' || saved === 'ar') {
          return saved;
        }
      } catch {
        // Local storage unavailable
      }
    }
    return 'ar';
  });

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('s7_admin_lang', lang);
    } catch {
      // Local storage unavailable
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  const isArabic = language === 'ar';

  const tAdmin = (key: AdminTranslationKey, params?: Record<string, string | number>): string => {
    const dict = adminTranslations[language] || adminTranslations.en;
    let text = (dict as Record<string, string>)[key] || (adminTranslations.en as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        tAdmin,
        isArabic,
      }}
    >
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className={isArabic ? 'font-cairo' : 'font-sans'}
      >
        {children}
      </div>
    </AdminLanguageContext.Provider>
  );
}

export function useAdminI18n() {
  return useContext(AdminLanguageContext);
}
