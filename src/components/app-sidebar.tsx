import * as React from "react"
import {
  IconChartBar,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  type Icon as TablerIcon
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAppSelector } from "@/store/hook"
import { useLocation } from "react-router-dom"

// -------- Types --------
export interface DocumentItem {
  name: string
  url: string
  icon: TablerIcon
}

export interface SecondaryItem {
  title: string
  url: string
  icon: TablerIcon
}

export interface SidebarUser {
  name?: string
  email?: string
  avatar?: string
}

// ------------------------

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()

  const data: {
    user: SidebarUser
    navMain: NavMainItem[]
    documents: DocumentItem[]
    navSecondary: SecondaryItem[]
  } = {
    user: {
      name: user?.username,
      email: user?.email,
      avatar: user?.avatar,
    },

    navMain: [
      { title: "Upload Ad", url: "/advertiser/uploadad", icon: IconListDetails },
      { title: "Lifecycle", url: "/advertiser/lifecycle", icon: IconListDetails },
      { title: "Analytics", url: "/advertiser/analytics", icon: IconChartBar },
      { title: "Projects", url: "/advertiser/projects", icon: IconFolder },
      { title: "Team", url: "/advertiser/team", icon: IconUsers },
    ],

    documents: [
      { name: "Data Library", url: "/advertiser/data", icon: IconDatabase },
      { name: "Reports", url: "/advertiser/reports", icon: IconReport },
      { name: "Word Assistant", url: "/advertiser/word", icon: IconFileWord },
    ],

    navSecondary: [
      { title: "Settings", url: "/advertiser/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  }

 
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
              <div className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Injera Platform.</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            isActive: pathname.startsWith(item.url),
          }))}
        />

        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {loading ? <>loading ...</> : <NavUser user={data.user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
