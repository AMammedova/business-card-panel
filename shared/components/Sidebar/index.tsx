"use client";

import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useMenuGroups } from "./constants/menuGroups";
import ClickOutside from "../ClickOutside";
// import Logo from "@/shared/icons/Logo";
import DashBoardIcon from "@/shared/icons/DashBoardIcon";
import SidebarItem from "./SidebarItem";
import { useTranslations } from "next-intl";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const menuGroups = useMenuGroups();
  const t = useTranslations("sidebar");
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <div className="flex items-center gap-4">
            {/* <Logo width={36} height={36} /> */}
            <h3 className="text-2xl font-bold text-white sm:text-title-md">
              {t("business_card")}
            </h3>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <DashBoardIcon />
          </button>
        </div>

        <div className="custom-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
}
