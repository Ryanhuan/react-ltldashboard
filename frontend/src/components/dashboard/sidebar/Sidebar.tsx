import styles from "./sidebar.module.scss";
import { clsx } from 'clsx';
import { useState } from 'react';
import { Link, NavLink } from "react-router-dom";

import LineStyleIcon from '@mui/icons-material/LineStyle';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

import imgLogoSmall from '@/assets/images/LOGO_small.png'

export default function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const baseSidebarStyle = clsx(styles.Link, styles.sidebarListLink);

  return (
    <div className={clsx(styles.sidebar, sidebar && styles.active)}>
      <div className={clsx(styles.wrapper, sidebar && styles.active)}>
        <div className={styles.sidebarMenuTitle}>
          <Link to='/Admin' className={styles.Link} >
            <div className={styles.logo}>
              <img src={imgLogoSmall} alt="LOGO" />
              <span className={styles.logoTitle}>後臺管理</span>
            </div>
          </Link>
          <div className={clsx(styles.toggle, sidebar && styles.active)}>
            <MenuIcon className={styles.toggleIcon} onClick={() => { setSidebar(!sidebar) }} />
          </div>
        </div>

        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>Main</h3>
          <ul className={styles.sidebarList}>
            <li className={styles.sidebarListItem} >
              <NavLink to='/Admin' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? styles.active : null} `} >
                <LineStyleIcon className={styles.sidebarIcon} />
                Home
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>材料管理</h3>
          <ul className={styles.sidebarList}>
            <li className={styles.sidebarListItem}>
              <NavLink to='/matManage' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <MailOutlineIcon className={styles.sidebarIcon} />
                材料管理
              </NavLink>
            </li>
            <li className={styles.sidebarListItem}>
              <NavLink to='/matCode' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <DynamicFeedIcon className={styles.sidebarIcon} />
                材料分類管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>產品管理</h3>
          <ul className={styles.sidebarList}>
            <li className={styles.sidebarListItem}>
              <NavLink to='/productManage' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <DynamicFeedIcon className={styles.sidebarIcon} />
                產品管理
              </NavLink>
            </li>
            <li className={styles.sidebarListItem}>
              <NavLink to='/productAdd' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <MailOutlineIcon className={styles.sidebarIcon} />
                產品新增
              </NavLink>
            </li>
            <li className={styles.sidebarListItem}>
              <NavLink to='/productCode' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <MailOutlineIcon className={styles.sidebarIcon} />
                產品分類管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>管理主頁</h3>
          <ul className={styles.sidebarList}>
            <li className={styles.sidebarListItem}>
              <NavLink to='/user' className={(navData) => clsx(baseSidebarStyle, navData.isActive && styles.active)} >
                <WorkOutlineIcon className={styles.sidebarIcon} />
                成員管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.sidebarFooter}>
          Copyright©RuiHuan2022<br /> All rights reserved <br />
        </div>
      </div>
    </div >
  )
  {/* {
  訂單管理:[網站會員管理,網站訂單管理],
  文章管理:[分類管理,內容管理],
  網站管理:[網站設定,網站資訊,首頁圖片,關於我們,FAQ]

} */}
}
