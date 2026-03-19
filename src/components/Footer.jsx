import Logo from "./Logo";

function GithubIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ExternalButton({ href, icon: Icon, label }) {
  const handleClick = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <button
      onClick={handleClick}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-150 text-xs"
    >
      <Icon size={13} />
      <span>{label}</span>
    </button>
  );
}

function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-dark-600 bg-white dark:bg-dark-800 px-6 py-4 flex-shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="text-slate-700 dark:text-white text-sm font-bold tracking-tight">
              WealthWise
            </span>
          </div>
          <span className="text-slate-300 dark:text-dark-500 text-xs hidden sm:block">
            ·
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs">
            Built by{" "}
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Shuaib Abdulhaqq Omeiza
            </span>
          </span>
          <span className="text-slate-300 dark:text-dark-500 text-xs hidden sm:block">
            ·
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-indigo-500/8 border border-indigo-500/15 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-500 dark:text-indigo-400 text-xs">
              React + Tailwind
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/8 border border-emerald-500/15 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-600 dark:text-emerald-400 text-xs">
              Data saved locally
            </span>
          </div>
          <ExternalButton
            href="https://github.com/YOUR_USERNAME/wealthwise"
            icon={GithubIcon}
            label="GitHub"
          />
          <ExternalButton
            href="https://linkedin.com/in/abdulhaqq-shuaib-56769239b"
            icon={LinkedinIcon}
            label="LinkedIn"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
