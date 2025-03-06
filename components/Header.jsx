import React from "react";
import TrueFocus from "./ui/TrueFocus";
import GradientText from "./ui/GradientText";

const Header = () => {
  return (
    <div className="flex justify-center items-center w-full h-[200px]">
      <div className="border-4 border-amber-50 w-[595px] h-[105px] flex justify-center items-center">
        <div className="text-3xl">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class text-3xl"
          >
            New Gen Mangareader
          </GradientText>
        </div>
      </div>
    </div>
  );
};

export default Header;
