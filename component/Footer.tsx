import { Footer } from "flowbite-react";
import { BsFacebook, BsTiktok, BsYoutube } from "react-icons/bs";

export function FooterComponents() {
  const currentYear = new Date().getFullYear();
  return (
    <Footer container className="fixed bottom-0 w-full z-50">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="https://www.famima.vn"
            src="/img/FamilyMart.png"
            alt="Flowbite Logo"

          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
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
