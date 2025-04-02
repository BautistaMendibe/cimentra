import Image from 'next/image';
import logo from '@/public/logo_header.svg';

export default function ImgLogoHeader() {

    // Este componente retorna un svg con el logo de la empresa, segun el activo 

  return (
    <div className="flex items-center my-2">        
        <Image
            src={logo}
            alt="Logo Cimentra"
            width={200}
            height={10}
        />
    </div>
  );
}