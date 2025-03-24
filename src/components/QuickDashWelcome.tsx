import { mdiCog, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";

export default function QuickDashWelcome() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mx-[25%] mt-10">
      <h2 className="text-lg font-semibold">Welcome to QuickDash!</h2>
      <p className="mt-2">
        There are currently no dashboards to display. To start a new one, use
        the add{" "}
        <span className="inline-flex items-center">
          <Icon path={mdiPlus} size={0.6} className="mx-1" />
        </span>{" "}
        button in the left right corner or use the settings menu{" "}
        <span className="inline-flex items-center">
          <Icon path={mdiCog} size={0.6} className="mx-1" />
        </span>{" "}
        in the upper right corner to import an existing dashboard.
      </p>
    </div>
  );
}
