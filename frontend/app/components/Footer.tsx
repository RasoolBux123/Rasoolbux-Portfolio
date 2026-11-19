export default function Footer() {
  return (
    <footer className="mt-28 border-t border-white/10 py-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} RB. Built with Next.js, Node.js and a lot of chai.
    </footer>
  );
}