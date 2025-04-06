import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? (

    <div className="flex w-full items-center justify-between">
      {/* Izquierda - icono menú */}
      <div className="flex items-center">
        <SidebarTrigger />
      </div>

      {/* Derecha - email, logout, theme */}
      <div className="flex items-center gap-4">
        <span className="text-sm">Hey, {user.email}!</span>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
        <ThemeSwitcher />
      </div>
    </div>



  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <ThemeSwitcher />
    </div>
  );
}
