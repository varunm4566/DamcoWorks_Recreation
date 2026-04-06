/**
 * Footer bar - #494949, 22px height
 */
export function Footer() {
  return (
    <footer className="h-[22px] bg-footer-bg flex items-center justify-between px-4 text-[11px] text-white/80 flex-shrink-0">
      <span>&copy; Damcoworks. All Rights Reserved</span>
      <div className="flex items-center gap-3">
        <a href="#" className="hover:text-white">Privacy Statement</a>
        <a href="#" className="hover:text-white">Copyright</a>
        <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
      </div>
    </footer>
  );
}
