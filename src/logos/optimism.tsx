import { JSX, SVGProps } from "react";

const OptimismLogo = (
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
    <g clipPath="url(#a)">
      <circle cx={16} cy={16.003} r={16} fill="#FF0420" />
      <path
        fill="#fff"
        d="M11.068 20.436c-.99 0-1.8-.233-2.432-.698-.624-.472-.937-1.15-.937-2.02 0-.186.02-.405.06-.67.106-.599.26-1.316.459-2.16.564-2.286 2.026-3.428 4.378-3.428.638 0 1.216.106 1.72.325.506.206.904.525 1.197.95.292.419.438.917.438 1.495 0 .173-.02.392-.06.658a26.937 26.937 0 0 1-.451 2.16c-.293 1.135-.79 1.993-1.508 2.557-.711.558-1.668.83-2.864.83Zm.18-1.794c.464 0 .856-.14 1.182-.412.332-.273.571-.691.71-1.262.194-.784.34-1.462.44-2.047.033-.173.053-.352.053-.538 0-.757-.392-1.136-1.183-1.136-.465 0-.864.14-1.196.412-.326.272-.558.69-.698 1.262a26.694 26.694 0 0 0-.451 2.047 2.652 2.652 0 0 0-.054.524c-.006.771.399 1.15 1.196 1.15ZM16.53 20.316c-.094 0-.16-.026-.213-.086-.04-.067-.053-.14-.04-.226l1.72-8.106a.331.331 0 0 1 .14-.226.366.366 0 0 1 .24-.086h3.315c.923 0 1.66.192 2.219.571.565.386.85.937.85 1.661 0 .206-.026.425-.073.651-.206.957-.624 1.661-1.262 2.12-.624.458-1.482.684-2.571.684h-1.681l-.572 2.73a.357.357 0 0 1-.14.227.366.366 0 0 1-.238.086h-1.695Zm4.411-4.764c.352 0 .651-.093.91-.285.266-.193.439-.465.525-.824.027-.14.04-.266.04-.372 0-.24-.073-.425-.213-.552-.139-.133-.385-.2-.724-.2h-1.495l-.471 2.233h1.428Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .003h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default OptimismLogo;
