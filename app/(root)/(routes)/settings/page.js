import { Settings } from "lucide-react";

import { checkSubscription } from "@/lib/subscription";
import { SubscriptionButton } from "@/components/SubscriptionButton";
import Navbar from "@/components/Navbar";

const SettingsPage = async () => {
  const isSubscribed = await checkSubscription();

  return (
    <>
      <Navbar />
      <div className="px-4 lg:px-8 flex items-center gap-x-3 my-8">
        <div className="p-2 w-fit rounded-md bg-slate-100">
          <Settings className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage account settings.
          </p>
        </div>
      </div>
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isSubscribed
            ? "You are currently subscribed!"
            : "You are currently unsubscribed."}
        </div>
        <SubscriptionButton isSubscribed={isSubscribed} />
      </div>
    </>
  );
};

export default SettingsPage;
