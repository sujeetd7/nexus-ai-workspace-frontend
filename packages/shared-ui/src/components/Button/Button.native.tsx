import type { FC } from "react";
import { Pressable, Text } from "react-native";
import type { ButtonProps } from "./Button.types";

export const Button: FC<ButtonProps> = ({ children, onPress }) => (
  <Pressable onPress={onPress}>
    <Text>{children}</Text>
  </Pressable>
);
