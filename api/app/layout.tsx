import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SelecText AI - 選択テキストをAIで解説・翻訳・要約',
  description: '英語テキストを選択して右クリック。Claude AIが瞬時に日本語で解説・翻訳・要約します。ビジネスパーソン・学習者向け日本語特化AI Chrome拡張機能。',
  keywords: ['AI翻訳 拡張機能', '英語 わからない 解説', 'Chrome拡張機能 AI', '日本語翻訳', 'テキスト解説'],
  openGraph: {
    title: 'SelecText AI - 選択テキストをAIで解説・翻訳・要約',
    description: '英語テキストを選択して右クリック。AIが瞬時に日本語解説・翻訳・要約',
    url: 'https://selectext-ai-api.vercel.app',
    siteName: 'SelecText AI',
    images: [{ url: 'https://selectext-ai-api.vercel.app/og.png', width: 1200, height: 630 }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SelecText AI',
    description: '英語テキストを選択して右クリック。AIが瞬時に日本語解説・翻訳・要約',
    images: ['https://selectext-ai-api.vercel.app/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, background: '#0f0f1a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
