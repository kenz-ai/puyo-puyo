import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/portfolio/Navbar';
import FadeIn from '@/components/portfolio/FadeIn';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const projects = [
  {
    id: 'puyo-puyo',
    title: 'ぷよぷよ',
    description:
      'ブラウザで動くぷよぷよゲーム。連鎖・スコア計算・BGM/SE・ポーズ・タッチ操作を完全実装。Claude Code との対話のみで一から構築した。',
    image: `${basePath}/images/puyo-v2.png`,
    tags: ['Next.js 16', 'TypeScript', 'React 19', 'Web Audio API', 'Tailwind CSS v4'],
    playHref: '/game',
    builtWith: 'Claude Code',
  },
];

const tagColors = [
  'bg-red-500/15 text-red-300 border-red-500/25',
  'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'bg-green-500/15 text-green-300 border-green-500/25',
  'bg-yellow-500/15 text-yellow-200 border-yellow-500/25',
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
];

const skills = [
  { label: 'AI Tools', items: ['Claude Code', 'GitHub Copilot'] },
  { label: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Other', items: ['Git', 'Vercel', 'GitHub Actions'] },
];

export default function PortfolioPage() {
  return (
    <div className="bg-[#0d1117] text-slate-100 font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-950/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-950/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-950/20 rounded-full blur-[80px]" />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-6">
        <div className="max-w-4xl mx-auto w-full">
          <p className="text-xs font-mono text-violet-400 tracking-[0.3em] mb-6 uppercase">
            AI × Vibe Coding
          </p>
          <h1 className="text-6xl sm:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
            <span className="text-slate-100">AIと一緒に、</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              作った。
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-10">
            Claude Code を使ってプロダクトを一から構築するポートフォリオ。
            コードを書くのではなく、対話しながら設計・実装・改善します。
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              作品を見る →
            </a>
            <a
              href="https://github.com/kenz-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg font-medium transition-colors text-sm"
            >
              GitHub
            </a>
          </div>

          {/* scroll hint */}
          <div className="mt-20 flex items-center gap-2 text-slate-600 text-xs font-mono animate-bounce">
            <span>scroll</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
              <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto w-full">
          <FadeIn>
            <p className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mb-12">
              Projects
            </p>
          </FadeIn>

          <div className="grid gap-8">
            {projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 100}>
                <article className="group rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden hover:border-slate-600 hover:bg-slate-900/60 transition-all duration-300">
                  <div className="grid md:grid-cols-[5fr_7fr]">
                    {/* Screenshot */}
                    <div className="relative overflow-hidden bg-slate-950 min-h-[260px]">
                      <Image
                        src={project.image}
                        alt={project.title + ' のスクリーンショット'}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/80 hidden md:block" />
                    </div>

                    {/* Info */}
                    <div className="p-8 flex flex-col justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded border border-violet-400/20 tracking-widest">
                          {project.builtWith}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, i) => (
                          <span
                            key={tag}
                            className={`text-[11px] px-2 py-0.5 rounded border font-mono ${tagColors[i % tagColors.length]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2">
                        <Link
                          href={project.playHref}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          <span>▶</span> プレイする
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How I Build ── */}
      <section id="process" className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto w-full">
          <FadeIn>
            <p className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mb-12">
              How I Build
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                label: 'プロンプト設計',
                desc: '要件と制約を言語化する。AIが最良の判断を下せるよう、文脈と意図を丁寧に整える。',
                accent: 'from-violet-500/20 to-violet-500/0',
              },
              {
                step: '02',
                label: '対話で実装',
                desc: 'Claude Code と往復しながら機能を積み上げる。コードを書くのではなく、導く。',
                accent: 'from-blue-500/20 to-blue-500/0',
              },
              {
                step: '03',
                label: 'レビュー・改善',
                desc: '動作確認と品質チェックをAIと共同で行い、プロダクト水準に仕上げる。',
                accent: 'from-emerald-500/20 to-emerald-500/0',
              },
            ].map(({ step, label, desc, accent }, i) => (
              <FadeIn key={step} delay={i * 120}>
                <div className={`relative p-6 rounded-xl border border-slate-800 bg-gradient-to-b ${accent} overflow-hidden h-full`}>
                  <span className="text-5xl font-bold text-slate-800/80 font-mono select-none">{step}</span>
                  <h3 className="text-slate-200 font-semibold mt-4 mb-2">{label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Skills */}
          <FadeIn delay={400}>
            <div className="mt-16 grid sm:grid-cols-3 gap-5">
              {skills.map(({ label, items }) => (
                <div key={label} className="p-5 rounded-xl border border-slate-800/60 bg-slate-900/20">
                  <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-3">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item} className="text-xs text-slate-300 bg-slate-800/60 px-2 py-1 rounded font-mono">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact / Footer ── */}
      <footer id="contact" className="relative z-10 border-t border-slate-800/60 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mb-8">Contact</p>
            <h2 className="text-3xl font-bold mb-4">一緒に作りませんか。</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-sm">
              AI開発・プロトタイピング・レビューなど、お気軽にご連絡ください。
            </p>
            <a
              href="mailto:kenz.handy@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-violet-500/60 hover:text-violet-300 text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              kenz.handy@gmail.com →
            </a>
          </FadeIn>

          <div className="mt-16 pt-8 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-700 font-mono">
            <span>kenz-ai</span>
            <span>Built with Claude Code</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
