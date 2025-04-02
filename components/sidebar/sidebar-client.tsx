"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ActivitySquareIcon, HomeIcon, LayoutGridIcon, PersonStandingIcon, TruckIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const data = [
  {
    title: "Trabajo",
    items: [
      { icon: HomeIcon, title: "Inicio", url: "/dashboard" },
      { icon: LayoutGridIcon, title: "Proyectos", url: "/projects" },
      { icon: ActivitySquareIcon, title: "Obras", url: "#" },
    ],
  },
  {
    title: "Gestión",
    items: [
      { icon: TruckIcon, title: "Proveedores", url: "#" },
      { icon: PersonStandingIcon, title: "Clientes", url: "#" },
    ],
  },
];

export function SidebarClient({ show }: { show: boolean }) {
  const pathname = usePathname();

  if (!show) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h1 className="text-xl font-bold">MyObrasApp</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
