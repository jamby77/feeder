import { ReactNode } from "react";
import { MenuItem } from "@/app/settings/menu-item";
import { Small } from "@/components/typography/typography";

const MenuItemIcon = ({ children }: { children: ReactNode }) => {
  return <div className="pointer-events-none me-5 h-5 w-5 shrink-0 align-top">{children}</div>;
};

export const SettingsNav = () => {
  return (
    <nav role="navigation" className="w-64 shrink-0 overflow-auto overscroll-contain py-6">
      <ul role="menu" className="flex min-w-fit flex-col gap-2 font-medium leading-3 text-foreground">
        <MenuItem href="/settings/config">
          <MenuItemIcon>
            <svg
              fill="currentColor"
              className="pointer-events-none block h-full w-full"
              viewBox="0 -960 960 960"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <g viewBox="0 -960 960 960">
                <path d="M666-163 475-354q-20 8-43.5 12.5T384-337q-99 0-169.5-70T144-576q0-37.78 9.5-71.89T182-711l144 144 70-70-144-144q29-17 62.5-26t69.5-9q100 0 170 71t70 170.19q0 22.81-4.5 42.31Q615-513 607-493l195 194q14 14.35 14 34.67Q816-244 802-230l-68 67q-14.09 14-34.04 14Q680-149 666-163Zm34-68 35-34-215-213q20-24 26-52.5t6-44.5q0-66.85-47.5-116.42Q457-741 390-744l82 81q11 11.18 11 26.09t-11.29 26.12L351.29-491.21Q340-480 325.82-480T301-491l-85-85q0 69 49.5 118T384-409q17 0 47-7t56-28l213 213ZM476-488Z"></path>
              </g>
            </svg>
          </MenuItemIcon>
          <Small>Config</Small>
        </MenuItem>
        <MenuItem href="/settings/feeds">
          <MenuItemIcon>
            <svg
              fill="currentColor"
              className="pointer-events-none block h-full w-full"
              viewBox="0 -960 960 960"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <g viewBox="0 -960 960 960">
                <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"></path>
              </g>
            </svg>
          </MenuItemIcon>
          <Small>Feeds</Small>
        </MenuItem>
      </ul>
    </nav>
  );
};

export default SettingsNav;
