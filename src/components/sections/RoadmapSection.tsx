import FadeInBlur from "../animations/FadeInBlur";
import FadeUp from "../animations/FadeUp";

const roadmap = [
  {
    steps: [
      "Outlining the primary project concept",
      "Legally registering the company",
      "Hiring key personnel in compliance with legal regulations",
      "Creating the pre-beta website v1.0",
      "Developing the pre-beta DOBI Analytics infrastructure v1.0",
    ],
    date: "2023 Q4",
    done: true,
  },
  {
    steps: [
      "We launched the official DOBI Analytics service",
      "We continued to enhance and customize our website",
      "Our team completed the Whitepaper for public release",
      "Internal .sol Audit documentation was finalized",
    ],
    date: "2024 Q1",
    done: true,
  },
  {
    steps: [
      "Preparing for the presale phase",
      "Conducting comprehensive tests for contract endurance, performance, and vulnerability",
      "Enlisting the support of our Marketing Team",
      "Initiating the testing phase for DOBISwap code",
    ],
    date: "2024 Q2",
    done: false,
  },
  {
    steps: [
      "Listing the token on CoinGecko and CoinMarketCap",
      "Commencing development on DOBIBastion",
      "Initiating development on DOBISwap",
      "Launching DOBI Swap for public use",
      "Introducing DOBI Bastion to the public",
    ],
    date: "2024 Q3",
    done: false,
  },
];
const RoadmapSection = () => {
  return (
    <section id="roadmap" className="lg:py-8">
      <div className="mx-4 rounded-3xl border-2 border-white/20 bg-[#14181C]/30 py-8 backdrop-blur-2xl transition-all duration-200 hover:border-[#3e1f5e] lg:py-16">
        <div className="container px-4 lg:px-0">
          <div className="mb-6">
            <h2 className="text-gradient sticky mb-4 text-center text-5xl leading-normal lg:text-left">
              Roadmap
            </h2>
            <h5 className="text-gradient sticky mb-4 text-center text-5m leading-normal lg:text-left">
              Further developments and updates are on the horizon
            </h5>
          </div>
          <div className="overflow-x-auto px-2 pt-20">
            {/* <div className="relative mb-12 h-2.5 w-full bg-gradient-to-r from-white to-white/0"></div> */}

            <div className="flex">
              {roadmap.map((item, index) => (
                <div
                  key={`roadmap-item-${index}`}
                  className={`relative whitespace-nowrap pr-4 before:absolute before:-top-[58px] before:h-2.5 before:w-full last:pr-0 lg:w-1/4 lg:whitespace-normal ${
                    (item.done && "before:bg-primary") || "before:bg-white"
                  }`}
                >
                  <div
                    className={`absolute -top-16 -left-2 z-20 h-6 w-6 rounded-full bg-primary ${
                      (!item.done && "ring-8 ring-primary/30") || ""
                    }`}
                  ></div>
                  <FadeUp delay={0.7 * index} className="flex flex-col gap-4">
                    {item.steps.map((step, stepIndex) => (
                      <p
                        key={`step-${index}-${stepIndex}`}
                        className="font-medium"
                      >
                        {stepIndex + 1}. {step}
                      </p>
                    ))}
                    <p className="text-lg text-white/50">{item.date}</p>
                  </FadeUp>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
