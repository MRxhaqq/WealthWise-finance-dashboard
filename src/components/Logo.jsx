import logo from "../assets/logo.svg";

function Logo({ size = 36, className = "" }) {
  return (
    <img
      src={logo}
      alt="WealthWise logo"
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
    />
  );
}

export default Logo;
