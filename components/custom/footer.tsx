import Link from "next/link";
import Wrapper from "./wrapper";
import Image from "next/image";
import { FaFacebookSquare as Facebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#20333C] space-y-10">
      <div className="h-[0.5px] bg-gray-500 mx-auto max-w-7xl" />
      <Wrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-white gap-5">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="logo" width={60} height={60} />
            <span className="text-2xl font-bold text-white tracking-wider">
              AOEK
            </span>
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="underline font-bold text-xl">Parent Links</h3>
          <Link
            href={"https://www.pwd.kerala.gov.in/IMF_website/index/"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Kerala PWD
          </Link>
          <Link
            href={"http://www.lsgkerala.gov.in"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Kerala LSGD
          </Link>
          <Link
            href={"https://www.irrigation.kerala.gov.in"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Kerala Irrigation Dept.
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="underline font-bold text-xl">Userful Links</h3>
          <Link
            href={"https://www.etenders.kerala.gov.in/nicgep/app"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Tenders Kerala
          </Link>
          <Link
            href={
              "https://www.spark.gov.in/webspark/(S(hzae3zw3gds1sbhw5rulsk2p))/sparklogin.aspx"
            }
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Spark
          </Link>
          <Link
            href={"https://www.price.kerala.gov.in/price3_pmu/"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            PRICE
          </Link>
          <Link
            href={"https://khri.kerala.gov.in/"}
            className="text-base w-fit hover:text-[#FACE30]"
            target="_blank"
          >
            Kerala Highway Research Institute
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="underline font-bold text-xl">Socials</h3>
          <Link
            href={"https://www.facebook.com/aoek"}
            className=" block"
            target="_blank"
          >
            <Facebook size={32} className="text-white" />
          </Link>
        </div>
      </Wrapper>
      <div className="h-[0.5px] bg-gray-500 mx-auto max-w-7xl" />
      <div className="w-full text-center text-white pb-5">
        <span className="font-bold">AOEK</span> &copy;{" "}
        {new Date().getFullYear()} - Powered by Ervinor
      </div>
    </footer>
  );
};

export default Footer;
