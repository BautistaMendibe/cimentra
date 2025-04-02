import Image from 'next/image';
import logo from '@/public/logo_header.svg';
import Link from "next/link"; 
import { createClient } from "@/utils/supabase/server";

export default async function ImgLogoHeader() {

  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center my-2">
        <Link href={"/"}>
          <Image
                src={logo}
                alt="Logo Cimentra"
                width={200}
                height={10}
            />
        </Link>        
      </div>
    ); 
  } else {
    return null;
  }
}