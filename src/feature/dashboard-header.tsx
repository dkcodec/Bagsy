import React from "react";
import { SidebarTrigger } from "../entities/sidebar";
import { Separator } from "../entities/separator";

const DashboardHeader:React.FC = () => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-bold">Панель Менеджера</h1>
          </div>
        </header>
    )
}

export default DashboardHeader;