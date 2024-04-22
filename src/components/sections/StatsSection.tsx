import FadeUp from "../animations/FadeUp";

const StatsSection = () => {
  const stats = [
    {
      title: "Total Holders",
      value: "0",
    },
    {
      title: "Total Transactions",
      value: "0",
    },
    {
      title: "Market Cap",
      value: "0",
    },
    {
      title: "Daily Volume",
      value: "0",
    },
  ];
  return (
    <section>
      <div className="container">
        <div className="h-px bg-gradient-to-r from-white/0 to-white/20" />
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeUp delay={i * 0.7} key={i} className="text-center">
                <h2 className="text-gradient mb-6 text-4xl font-bold text-white">
                  {stat.value}
                </h2>
                <h4 className="text-xl font-medium text-white">{stat.title}</h4>
              </FadeUp>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-white/20 to-white/0" />
      </div>
    </section>
  );
};

export default StatsSection;
