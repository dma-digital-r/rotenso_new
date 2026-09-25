import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Button variants from the Figma library: "BTN L Red", "BTN M Red", "BTN M White",
// "BTN S Red", "BTN S Outline", "BTN S Outline White".
const variants = {
  "l-red": "rounded-[26px] px-[25px] py-[20px] text-[16px] bg-rotenso-red text-white",
  "m-red": "rounded-[21px] px-[18px] py-[15px] text-[16px] bg-rotenso-red text-white",
  "m-white": "rounded-[21px] px-[18px] py-[15px] text-[16px] bg-white text-rotenso-grey",
  "s-red": "rounded-[15px] px-[15px] py-[10px] text-[12px] bg-rotenso-red text-white",
  "s-outline":
    "rounded-[15px] px-[15px] py-[10px] text-[12px] border border-rotenso-grey text-rotenso-grey",
  "s-outline-white":
    "rounded-[15px] px-[15px] py-[10px] text-[12px] border border-white text-white",
} as const;

export type ButtonVariant = keyof typeof variants;

const base =
  "inline-flex shrink-0 items-center justify-center overflow-clip font-bold whitespace-nowrap leading-[normal] transition-opacity hover:opacity-85";

type Props = {
  variant: ButtonVariant;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant, href, className = "", children, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const label = <span className="text-trim">{children}</span>;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" className={`${cls} cursor-pointer`} {...rest}>
      {label}
    </button>
  );
}
