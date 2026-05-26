import { Pressable, Text } from "react-native";
import { tv, VariantProps } from "tailwind-variants";

const buttonStyles = tv({
  base: "text-white rounded-full px-5 py-1 bg-blue-700 hover:bg-blue-900 active:bg-blue-950",
});

const textStyles = tv({
  base: "text-white text-base",
});

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
};

export function Button({ children, className, textClassName }: ButtonProps) {
  function renderChildren() {
    switch (typeof children) {
      case "string":
      case "number":
        return (
          <Text className={textStyles({ className: textClassName })}>
            {children}
          </Text>
        );
      default:
        return children;
    }
  }

  return (
    <Pressable className={buttonStyles({ className })}>
      {renderChildren()}
    </Pressable>
  );
}
