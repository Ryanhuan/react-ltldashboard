import styles from "./sidebar.module.scss";
import { clsx } from 'clsx';
import { useState } from 'react';
import { Link, NavLink } from "react-router-dom";

import LineStyleIcon from '@mui/icons-material/LineStyle';
import MenuIcon from '@mui/icons-material/Menu';
import imgLogoSmall from '@/assets/images/LOGO_small.png'
import { pageSettings } from "@/pageSettings";

export default function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const baseSidebarStyle = clsx(styles.Link, styles.sidebarListLink);

  const linkTree = pageSettings.Admin.map((ele, index) => (
    <div className={styles.sidebarMenu} key={index}>
      <h3 className={styles.sidebarTitle}>{ele.treeHeader}</h3>
      <ul className={styles.sidebarList}>
        {ele.treeChildren.map((treeChild, childIndex) => (
          ele.treeHeader !== '' ?
            <li className={styles.sidebarListItem} key={childIndex}>
              <NavLink to={treeChild.href} className={(navData) => clsx(baseSidebarStyle, navData.isActive ? styles.active : null)} >
                {treeChild.icon !== undefined ?
                  <>
                    <treeChild.icon className={styles.sidebarIcon} />
                    {treeChild.pageTitle}
                  </>
                  :
                  <>
                    <LineStyleIcon className={styles.sidebarIcon} />
                    {treeChild.pageTitle}
                  </>
                }
              </NavLink>
            </li>
            : ''
        ))}

      </ul>
    </div>
  ))


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

        {linkTree}

        <div className={styles.sidebarFooter}>
          Copyright©RuiHuan2022<br /> All rights reserved <br />
        </div>
      </div>
    </div >
  )
}
