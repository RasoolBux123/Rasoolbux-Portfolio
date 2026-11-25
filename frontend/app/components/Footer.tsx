import VisitorCounter from "./VisitorCounter";

export default function Footer() {
  return (
    <footer className="mt-28 flex flex-col items-center gap-4 border-t border-white/10 py-8 text-center text-sm text-gray-500">
      <VisitorCounter />
      <p>© {new Date().getFullYear()} RB. Built with Next.js, Node.js and a lot of chai.</p>
    </footer>
  );
}