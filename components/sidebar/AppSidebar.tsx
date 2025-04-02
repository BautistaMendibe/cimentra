import { SidebarClient } from "./sidebar-client";
import { createClient } from "@/utils/supabase/server";

export async function AppSidebar() {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    return <SidebarClient show={!!user} />;
}
