import { useState } from "react";
import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import { BuyWIthCardModal } from "../BuyWithCardModal";

const HowToBuySection = () => {
  const [isBuyWithCardModalOpen, setIsBuyWithCardModalOpen] = useState(false);

  const steps = [
    {
      title: "Bastion: Your Cryptocurrency Fortress",
      description:
        "DobiFy is your vigilant guardian against threats lurking in the digital shadows. Let DOBI proactively sniff out any potential risks, ensuring that your blockchain journey is as secure as it is rewarding.",
    },
    {
      title: "Fun: DobiVerse and NFTs",
      description:
        "Whether you're a seasoned investor looking to explore new opportunities in the world of NFTs or a business owner seeking innovative ways to promote your brand, the DobiFy Metaverse offers endless possibilities for growth and engagement.",
    },
    {
      title: "Comunity Utility: Analytics and Trending",
      description:
        "Our secret weapon is the DobiFy crypto affiliate AI network—a cutting-edge platform that delivers professional analyses and insights. Powered by advanced algorithms and developed within the DobiFy project.",
    },
  ];
  return (
    <section id="ecosystem" className="py-12 lg:py-24">
      <div className="container flex flex-col items-center gap-8 px-4 lg:flex-row lg:gap-16 lg:px-0">
        <FadeLeft className="flex w-full flex-col gap-6 lg:w-1/2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="gradient-border flex w-full flex-col items-center gap-6 rounded-2xl bg-[#1A2025]/70 p-8 backdrop-blur-xl transition-all duration-200 hover:scale-105 lg:flex-row"
            >
              <div className="gradient-border flex h-16 w-16 items-center justify-center text-3xl font-bold before:rounded-full lg:h-20 lg:w-20">
                {index + 1}.
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-gradient mb-4 text-xl font-medium">
                  {step.title}
                </h4>
                <p className="text-white/80">{step.description}</p>
              </div>
            </div>
          ))}
        </FadeLeft>
        <FadeRight className="w-full lg:w-1/2">
          <h2 className="text-gradient mb-4 text-center text-5xl leading-normal lg:text-left">
            DobiFy Ecosystem
          </h2>
          <div className="mb-4 flex flex-col gap-4 text-center font-normal leading-relaxed text-white/80 lg:mb-8 lg:text-left lg:text-lg">
            <p>
              Explore our entire DobiFy Exosystem!
            </p>
            <p>
            We are determined to propel the DOBI Project to new heights by establishing independence from other platforms and creating our comprehensive ecosystem.
            </p>
          </div>
          <button
            onClick={() => window.location.href = 'https://whitepaper.dobify.io'}
            className="mx-auto flex items-center gap-3 rounded-full bg-primary py-4 px-6 font-semibold text-black transition-opacity duration-200 hover:opacity-75 lg:mx-0"
          >
            Whitepaper
          </button>
        </FadeRight>
      </div>
      {isBuyWithCardModalOpen && (
        <BuyWIthCardModal closeModal={() => setIsBuyWithCardModalOpen(false)} />
      )}
    </section>
  );
};

export default HowToBuySection;
