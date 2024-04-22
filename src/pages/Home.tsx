import { ethereumClient } from "../utils/wagmi";
import { Web3Modal } from "@web3modal/react";

import { ReferralModalTarget } from "../components/ReferralModal";
import HeaderSection from "../components/sections/HeaderSection";
import LogosSection from "../components/sections/LogosSection";
import Navbar from "../components/Navbar";
import HowToBuySection from "../components/sections/HowToBuySection";
import RoadmapSection from "../components/sections/RoadmapSection";
import TokenomicsSection from "../components/sections/TokenomicsSection";
import TeamSection from "../components/sections/TeamSection";
import Footer from "../components/Footer";
import { useEffect } from "react";
import WebglFluidAnimation from "../components/WebglFluidAnimation";
import StatsSection from "../components/sections/StatsSection";
import { SelectTokenModalTarget } from "../components/SelectTokenModal";
import { useAccount, useDisconnect } from "wagmi";
import { useDispatch } from "react-redux";
import { fetchReferralCode } from "../utils/apis";
import { setUser } from "../store/wallet";
import { BuyWIthCardModalTarget } from "../components/BuyWithCardModal";

import RoadMap from "../components/RoadMap";
import Ecosystem from "../components/Ecosystem";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

function Home() {
  const { address, isConnected } = useAccount();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window?.location.search);
    const referralId = searchParams.get("ref");
    if (referralId?.length === 6) {
      localStorage.setItem("ref", referralId);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    signIn();
  }, [isConnected]);

  const signIn = async () => {
    try {
      const { user } = await fetchReferralCode(address as string);
      dispatch(setUser({ ...user }));
    } catch (e) {
      console.log(e);
      useDisconnect();
    }
  };

  useEffect(() => {
    let newEvent: any;

    window.addEventListener("mousemove", (event: any) => {
      newEvent = new event.constructor(event.type, event);
    });

    document.addEventListener("mousemove", (event: any) => {
      if (event.isTrusted && newEvent) {
        document.getElementById("webgl-fluid")?.dispatchEvent(newEvent);
      }
    });
  }, []);
  return (
    <>
      <Navbar />
      <main id="main" className="flex overflow-x-hidden flex-col">
       <div className="hero_wrapper mt-10 md:mt-0 flex-col px-3 md:px-0 md:flex-row h-auto md:h-[500px] container mx-auto flex justify-between items-center ">
             <div className="left_hero w-full md:w-[48%]">
                 <h1 className="game text-5xl md:text-[80px] md:leading-[80px] font-black">Ultimate Security Token</h1>
                 <p className="font-black game text-2xl mt-[35px]">Join the DobiFy community today and experience the peace of mind that comes from having a guardian on your side.</p>
              <div className="flex justify-start  mt-7 items-center">
              <a className="from-[#00ea42] to-[#00eaac] text-black hover:text-white hover:bg-black py-3 px-8 md:py-5 md:px-12 rounded-full bg-gradient-to-l " href="/buy">
                 BUY NOW
               </a>
               <a className="ring-1 hover:bg-black ring-inset ml-3 ring-[#00EA5A] py-3 px-8 md:py-5 md:px-12  rounded-full bg-gradient-to-l " href="">
                TRADE NOW
               </a>
              </div>
             </div>


             <div className="left_hero relative flex justify-center items-center mt-10 md:mt-0 w-full md:w-[48%]">
                  <img className="h1 w-full h-[400px]"  src="img/h1.png" alt="h1"/>
                  <img className="h3 absolute right-0 w-full h-[150]"  src="img/h3.png" alt="h3"/>
                  <img className="h6 absolute  -bottom-5 md:-bottom-[134px] w-full h-[150]"  src="img/h6.png" alt="h6"/>
                  <img className="h2 absolute  -bottom-2 md:-bottom-[120px] w-full h-[150]"  src="img/h2.png" alt="h2"/>
                  <img className="h4 absolute  top-10 md:-top-[134px] left-0 w-full h-[150]"  src="img/h4.png" alt="h4"/>
                  <img className="h5 absolute  top-10 md:-top-[134px] left-10 w-full h-[150]"  src="img/h5.png" alt="h5"/>
           
             </div>

       </div>
        <LogosSection />
        {/* <HowToBuySection /> */}
        <RoadMap/>
        {/* <RoadmapSection /> */}
        <Ecosystem/>
        <TokenomicsSection />
        {/* <StatsSection /> */}
        <TeamSection />
        <Footer />
      </main>
      <SelectTokenModalTarget />
      <ReferralModalTarget />
      <BuyWIthCardModalTarget />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <WebglFluidAnimation />
    </>
  );
}

export default Home;
