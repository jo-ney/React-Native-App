import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
import { View } from "react-native";

import animation from "../../assets/animations/Running Fox Loop.json";

type Props = { width?: number; height?: number };

export default function AnimationExample({ width = 400, height = 300 }: Props) {
  return (
    <View style={{ width, height }}>
      <DotLottieReact
        data={animation as any}
        autoplay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}