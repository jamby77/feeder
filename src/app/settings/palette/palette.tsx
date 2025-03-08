import { JSX, ReactNode } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import { DefaultColors } from "tailwindcss/types/generated/colors";
import { Large, Small } from "@/components/typography/typography";
import tailwindConfig from "../../../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
const Color = ({ colorName, color }: { colorName: string; color: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="h-36 w-36 border shadow-md"
        style={{
          backgroundColor: color,
        }}
      />
      <Small className="mt-4">{colorName}</Small>
    </div>
  );
};
const ColorSection = ({ sectionName, children }: { sectionName: string; children: ReactNode }) => {
  return (
    <div className="rounded-lg border p-4">
      <Large className="mb-4">{sectionName}</Large>
      <div className="grid grid-cols-4 gap-4">{children}</div>
    </div>
  );
};

function generatePalette(colors: DefaultColors, prefix?: string, level = 0): JSX.Element[] {
  const colorsArray = Object.entries(colors).reverse();
  const result: JSX.Element[] = [];
  const singles: JSX.Element[] = [];
  for (let [colorName, c] of colorsArray) {
    if (typeof c !== "string") {
      // recursively merge colors
      result.push(
        <ColorSection sectionName={colorName} key={colorName}>
          {generatePalette(c, colorName, level + 1)}
        </ColorSection>,
      );
    } else {
      const name = `${prefix ? prefix + "-" : ""}${colorName}`;
      if (level !== 0) {
        result.push(<Color key={name} color={c} colorName={name} />);
      } else {
        singles.push(<Color key={name} color={c} colorName={name} />);
      }
    }
  }
  if (singles.length > 0) {
    result.unshift(
      <ColorSection sectionName="Singles" key="singles">
        {singles}
      </ColorSection>,
    );
  }
  return result;
}

export const Palette = () => {
  return <div className="flex max-w-4xl flex-wrap gap-4">{generatePalette(fullConfig.theme.colors)}</div>;
};

export default Palette;
