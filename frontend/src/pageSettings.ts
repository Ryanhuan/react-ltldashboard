import loadable from "@loadable/component"; //lazy loading

//function Component
const home = loadable(() => import("@/pages/dashboard/home/home"));
const user = loadable(() => import("@/pages/dashboard/user/user"));

//class Component
const matManage = loadable(
  () => import("@/pages/dashboard/matManage/matManage"),
  {
    resolveComponent: (components: any) => components.matManage,
  }
);
const matCode = loadable(() => import("@/pages/dashboard/matCode/matCode"), {
  resolveComponent: (components: any) => components.matCode,
});
const productManage = loadable(
  () => import("@/pages/dashboard/productManage/productManage"),
  {
    resolveComponent: components => components.productManage,
  }
);
const productCode = loadable(
  () => import("@/pages/dashboard/productCode/productCode"),
  {
    resolveComponent: (components: any) => components.productCode,
  }
);
const productAdd = loadable(
  () => import("@/pages/dashboard/productAdd/productAdd"),
  {
    resolveComponent: components => components.productAdd,
  }
);

export const pageSettings: I_pageSettings = {
  Admin: [
    { pageTitle: 'HOME', href: '/Admin', element: home },
    { pageTitle: "成員管理", href: "/user", element: user },
    { pageTitle: "材料管理", href: "/matManage", element: matManage },
    { pageTitle: "材料分類管理", href: "/matCode", element: matCode },
    { pageTitle: "產品管理", href: "/productManage", element: productManage },
    { pageTitle: "產品分類管理", href: "/productCode", element: productCode },
    { pageTitle: "產品新增", href: "/productAdd", element: productAdd },

    { pageTitle: "", href: "*", element: home },
  ],
};

interface I_pageSettings {
  Admin: I_Admin[];
}

interface I_Admin {
  pageTitle: string;
  href: string;
  element: any;
}
