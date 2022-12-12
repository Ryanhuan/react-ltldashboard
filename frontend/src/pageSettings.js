import loadable from '@loadable/component'; //lazy loading

//function Component
const Home = loadable(() => import('./pages/home/Home'));
const AdminUser = loadable(() => import('./pages/admin/adminUser/AdminUser'));

//class Component
const AdminMatManage = loadable(() => import('./pages/admin/adminMatManage/AdminMatManage'), {
    resolveComponent: (components) => components.AdminMatManage,
});
const AdminMatCode = loadable(() => import('./pages/admin/adminMatCode/AdminMatCode'), {
    resolveComponent: (components) => components.AdminMatCode,
});
const AdminProductManage = loadable(() => import('./pages/admin/adminProductManage/AdminProductManage'), {
    resolveComponent: (components) => components.AdminProductManage,
});
const AdminProductCode = loadable(() => import('./pages/admin/adminProductCode/AdminProductCode'), {
    resolveComponent: (components) => components.AdminProductCode,
});
const AdminProductAdd = loadable(() => import('./pages/admin/adminProductAdd/AdminProductAdd'), {
    resolveComponent: (components) => components.AdminProductAdd,
});

export const pageSettings = {

    Admin: [
        { title: 'Home', pageTitle: '', href: '/Admin', element: <Home /> },
        { title: 'AdminUser', pageTitle: '成員管理', href: '/AdminUser', element: <AdminUser /> },
        { title: 'AdminMatManage', pageTitle: '材料管理', href: '/AdminMatManage', element: <AdminMatManage /> },
        { title: 'AdminMatCode', pageTitle: '材料分類管理', href: '/AdminMatCode', element: <AdminMatCode /> },
        { title: 'AdminProductManage', pageTitle: '產品管理', href: '/AdminProductManage', element: <AdminProductManage /> },
        { title: 'AdminProductCode', pageTitle: '材料分類管理', href: '/AdminProductCode', element: <AdminProductCode /> },
        { title: 'AdminProductAdd', pageTitle: '產品新增', href: '/AdminProductAdd', element: <AdminProductAdd /> },

        { title: '', pageTitle: '', href: '*', element: <Home /> },
    ],
};
