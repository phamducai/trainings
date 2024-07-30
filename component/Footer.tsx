import { Footer } from "flowbite-react";
import { BsFacebook, BsTiktok, BsYoutube,BsFillPhoneFill, BsMailbox2Flag} from "react-icons/bs";

export function FooterComponents() {
  const currentYear = new Date().getFullYear();
  return (
    <Footer container className="w-full z-50">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="https://www.famima.vn"
            src="/img/FamilyMart.png"
            alt="Flowbite Logo"

          />
           <div className="text-left">
            <div>
              <Footer.Title title="Liên Hệ" />
              <Footer.LinkGroup col className="text-left">
                <a  href="mailto:nhansu@famima.vn"  className="text">Email : nhansu@famima.vn</a>
                <a href="tel:02839306575">Hotline : 02839306575 - Line 208</a>
              </Footer.LinkGroup>
            </div>
          
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full flex items-center justify-between">
          <Footer.Copyright href="#" by="Famima™" year={currentYear} />
          <div className="flex items-center justify-center gap-4">
            <Footer.Icon href="https://www.facebook.com/FamilyMartVietnam/" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsYoutube} />
            <Footer.Icon href="https://www.tiktok.com/@familymartvnofficial" icon={BsTiktok} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
