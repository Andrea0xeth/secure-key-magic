import { useTheme } from "next-themes";

export const Header = () => {
  const { theme } = useTheme();
  
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <img 
          src="/artence-logo-white.svg" 
          alt="Artence Logo" 
          className="h-12 w-auto hidden dark:block"
        />
        <img 
          src="/artence-logo-black.svg" 
          alt="Artence Logo" 
          className="h-12 w-auto dark:hidden"
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-artence-purple to-primary dark:from-artence-purple dark:to-primary">
        Artence Passkey
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Secure Algorand authentication using passkeys
      </p>
    </div>
  );
};