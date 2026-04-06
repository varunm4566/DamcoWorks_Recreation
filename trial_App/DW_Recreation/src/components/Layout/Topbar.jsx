export function Topbar() {
  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between px-4 bg-white border-b border-[#dee2e6] left-0 md:left-[75px]"
      style={{ height: 50 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded text-white text-[12px] font-bold select-none flex-shrink-0"
          style={{ backgroundColor: '#e32200' }}
        >
          DW
        </div>
        <span className="text-[15px] font-bold" style={{ color: '#e32200' }}>
          DamcoWorks
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold select-none"
          style={{ backgroundColor: '#5c3d8f' }}
        >
          KS
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-black">Kaushki Singh</span>
          <span className="text-[10px]" style={{ color: '#595959' }}>PMO Analyst</span>
        </div>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#595959" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}
