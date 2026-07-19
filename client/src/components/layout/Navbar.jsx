import {
  Bell,
  Search,
  Settings,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Search */}
      <div className="relative w-96">

        <Search
          size={20}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          className="
            w-full
            h-11
            rounded-full
            bg-slate-800
            border
            border-slate-700
            text-white
            outline-none
            transition-all
            duration-300
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button className="text-slate-300 hover:text-blue-400 transition-colors">
          <Bell size={22} />
        </button>

        <button className="text-slate-300 hover:text-blue-400 transition-colors">
          <Settings size={22} />
        </button>

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
            G
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Ganesh
            </h3>

            <p className="text-xs text-slate-400">
              Software Developer
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}