import { SparkBadge } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <SparkBadge
        speed={1.00}
        particleAmount={1.00}
        rainAmount={1.00}
        turbulence={1.00}
        spread={1.00}
      />
    </div>
  );
}

export default Scene;
