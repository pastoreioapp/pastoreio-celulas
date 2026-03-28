import Image from "next/image";
import type { ComponentProps } from "react";

export type IconProps = Omit<
  ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  alt?: string;
};

type AssetIconProps = IconProps & {
  src: string;
  width: number;
  height: number;
};

function AssetIcon({
  src,
  width,
  height,
  alt = "",
  ...props
}: AssetIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      {...props}
    />
  );
}

export function SaveMemberIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/save-member.svg"
      width={20}
      height={20}
      {...props}
    />
  );
}

export function MemberInputIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/member-input.svg"
      width={22}
      height={24}
      {...props}
    />
  );
}

export function ContextChevronIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/context-chevron.svg"
      width={40}
      height={40}
      {...props}
    />
  );
}

export function AccordionChevronIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/accordion-chevron.svg"
      width={12}
      height={8}
      {...props}
    />
  );
}

export function LeaderChipIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/leader-chip.svg"
      width={11}
      height={11}
      {...props}
    />
  );
}

export function ScheduleChipIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/schedule-chip.svg"
      width={12}
      height={14}
      {...props}
    />
  );
}

export function PastoreioOneIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/pastoreio-01.svg"
      width={44}
      height={44}
      {...props}
    />
  );
}

export function PastoreioTwoIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/pastoreio-02.svg"
      width={44}
      height={44}
      {...props}
    />
  );
}

export function DiscipuladoIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/discipulado.svg"
      width={44}
      height={44}
      {...props}
    />
  );
}

export function LiderCelulaIcon(props: IconProps) {
  return (
    <AssetIcon
      src="/figma/icons/lider-celula.svg"
      width={44}
      height={44}
      {...props}
    />
  );
}
