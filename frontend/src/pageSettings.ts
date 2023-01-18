import loadable from "@loadable/component"; //lazy loading
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

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
    {
      treeHeader: "Main",
      treeChildren: [
        {
          pageTitle: "HOME",
          href: "/Admin",
          element: home,
          icon: ChatBubbleOutlineIcon,
        },
      ],
    },
    {
      treeHeader: "材料管理",
      treeChildren: [
        {
          pageTitle: "材料管理",
          href: "/matManage",
          element: matManage,
          icon: DynamicFeedIcon,
        },
        {
          pageTitle: "材料分類管理",
          href: "/matCode",
          element: matCode,
          icon: DynamicFeedIcon,
        },
      ],
    },
    {
      treeHeader: "產品管理",
      treeChildren: [
        {
          pageTitle: "產品管理",
          href: "/productManage",
          element: productManage,
          icon: WorkOutlineIcon,
        },
        {
          pageTitle: "產品分類管理",
          href: "/productCode",
          element: productCode,
          icon: WorkOutlineIcon,
        },
        {
          pageTitle: "產品新增",
          href: "/productAdd",
          element: productAdd,
          icon: WorkOutlineIcon,
        },
      ],
    },
    {
      treeHeader: "管理主頁",
      treeChildren: [
        {
          pageTitle: "成員管理",
          href: "/user",
          element: user,
          icon: MailOutlineIcon,
        },
      ],
    },
    {
      treeHeader: "",
      treeChildren: [{ pageTitle: "", href: "*", element: home }],
    },
  ],
};


interface I_pageSettings {
  Admin: I_Admin[];
}

interface I_Admin {
  treeHeader:string;
  treeChildren:I_treeChildren[];
}

interface I_treeChildren{
  pageTitle: string;
  href: string;
  element: any;
  icon?: any;
}



 {/* {
  訂單管理:[網站會員管理,網站訂單管理],
  文章管理:[分類管理,內容管理],
  網站管理:[網站設定,網站資訊,首頁圖片,關於我們,FAQ]

} */}