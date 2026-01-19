import { Link } from 'react-router-dom';

const faqs = [
  { q: 'Is this marketing?', a: 'Yes, in the simplest sense. No, in the way people usually mean it.' },
  { q: 'Will this make my product successful?', a: 'No. It makes your product eligible.' },
  { q: 'Do I still need to think about content?', a: 'Only once. After that, no.' },
  { q: 'What if nobody responds?', a: 'That is normal. Most decisions are silent.' },
  { q: 'Who is this not for?', a: 'People who enjoy marketing. People who want analytics. People who want tricks.' },
  { q: 'Why not just post manually?', a: 'Because memory fails. Consistency matters more than intention.' },
  { q: 'What does "possibly picked" mean?', a: 'It means being present when someone is ready.' },
  { q: 'Is repetition annoying?', a: 'Only to the person repeating. Not to the person noticing.' },
  { q: 'What happens if I stop?', a: 'Nothing bad. Things simply go quiet again.' },
  { q: 'Why is this so simple?', a: 'Because simplicity works. Complexity mostly delays.' },
];

export function FAQ() {
  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">MFS Autopilot</Link>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-[#e0e0e0] hover:text-white transition-colors">How It Works</Link>
            <Link to="/faq" className="text-white font-medium">FAQ</Link>
            <Link to="/pricing" className="text-[#e0e0e0] hover:text-white transition-colors">Pricing</Link>
            <Link to="/login" className="text-[#e0e0e0] hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-16 text-center">FAQ</h1>
          
          <div className="space-y-12">
            {faqs.map(({ q, a }) => (
              <div key={q}>
                <h2 className="text-xl font-semibold text-white mb-3">{q}</h2>
                <p className="text-[#e0e0e0]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#e0e0e0] text-sm">
          <span>&copy; 2026 MFS Autopilot</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
