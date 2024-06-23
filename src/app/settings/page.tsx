import Config from "@/app/settings/config";

const SettingsPage = () => {
  return (
    <main className="w-full px-4 md:px-6">
      <h1 className="pb-6 text-2xl text-gray-900 dark:text-gray-300">Configuration</h1>
      <Config />
    </main>
  );
};

export default SettingsPage;
