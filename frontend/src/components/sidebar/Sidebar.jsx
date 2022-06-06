import "./sidebar.css"
import { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { LineStyle, Menu, ChatBubbleOutline, MailOutline, DynamicFeed, WorkOutline } from '@material-ui/icons';



export default function Sidebar() {

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  const baseSidebarStyle = "Link sidebarListLink ";

  return (
    <div className={sidebar ? 'sidebar active' : 'sidebar'}>
      <div className={sidebar ? 'sidebarWrapper active' : 'sidebarWrapper'}>
        <div className="sidebarMenuTitle">
          <Link to='/Admin' className="Link"  >
            <div className="logo">
              <img src="/images/LOGO_small.png" alt="LOGO" />
              <span className="logoTitle">後臺管理</span>
            </div>
          </Link>
          <div className={sidebar ? 'toggle active' : 'toggle'} >
            <Menu className='toggleIcon' onClick={showSidebar} />
          </div>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Main</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem" >
              <NavLink to='/Admin' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <LineStyle className="sidebarIcon" />
                Home
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">網站管理</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/users' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <MailOutline className="sidebarIcon" />
                網站設定
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `}  >
                <DynamicFeed className="sidebarIcon" />
                網站資訊
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <ChatBubbleOutline className="sidebarIcon" />
                首頁圖片
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <ChatBubbleOutline className="sidebarIcon" />
                關於我們
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <ChatBubbleOutline className="sidebarIcon" />
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">材料管理</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/AdminMatManage' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <MailOutline className="sidebarIcon" />
                材料管理
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <DynamicFeed className="sidebarIcon" />
                材料分類管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">產品管理</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <MailOutline className="sidebarIcon" />
                分類管理
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <DynamicFeed className="sidebarIcon" />
                產品內容
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">訂單管理</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `}  >
                <MailOutline className="sidebarIcon" />
                網站會員管理
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <DynamicFeed className="sidebarIcon" />
                網站訂單管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">文章管理</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <MailOutline className="sidebarIcon" />
                分類管理
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink to='/EX' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `} >
                <DynamicFeed className="sidebarIcon" />
                內容管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">管理主頁</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink to='/AdminUser' className={`${baseSidebarStyle} + ${(navData) => navData.isActive ? "active" : ""} `}  >
                <WorkOutline className="sidebarIcon" />
                成員管理
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebarFooter">
          <div className="sidebarFooterContainer">
            Copyright © RuiHuan 2022 <br /> All rights reserved <br />
          </div>
        </div>
      </div>
    </div>
  )
}
