import TokenomicsImg from "../../assets/svg/tokenomics.svg";
import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="py-12 lg:py-24">
      <div className="container px-4 lg:px-0">
        <FadeLeft>
          <h2 className="text-gradient mb-12 text-center text-5xl leading-normal lg:mb-24">
            Tokenomics
          </h2>
        </FadeLeft>
        <FadeRight>
          <img
            src={TokenomicsImg}
            alt="Tokenomics"
            className="mx-auto w-full max-w-3xl"
          />
        </FadeRight>
      </div>
    </section>
  );
};

export default TokenomicsSection;
