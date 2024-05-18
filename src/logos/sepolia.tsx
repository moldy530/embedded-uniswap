import { JSX, SVGProps } from "react";

const SepoliaLogo = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <circle cx={16} cy={16} r={15.5} stroke="#94A3B8" strokeDasharray="2 2" />
    <path
      fill="currentColor"
      d="M15.996 13.033 9 16.211l6.996 4.138L23 16.211l-7.004-3.178Z"
      opacity={0.6}
    />
    <path
      fill="#6072BA"
      fillOpacity={0.66}
      d="m9 16.21 6.996 4.14V4.595L9 16.211Z"
    />
    <path
      fill="#48518D"
      d="M15.996 4.596v15.753L23 16.211 15.996 4.596Z"
      opacity={0.8}
    />
    <path
      fill="#2E50BC"
      d="m9 17.542 6.996 9.862v-5.732L9 17.542Z"
      opacity={0.45}
    />
    <path
      fill="#495393"
      d="M15.996 21.672v5.732L23 17.542l-7.004 4.13Z"
      opacity={0.8}
    />
  </svg>
);
export default SepoliaLogo;
