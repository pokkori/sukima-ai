import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://selectext-ai-api.vercel.app'),
  title: 'SelecText AI - 選択テキストをAIで解説・翻訳・要約',
  description: '英語テキストを選択して右クリック。Claude AIが瞬時に日本語で解説・翻訳・要約します。ビジネスパーソン・学習者向け日本語特化AI Chrome拡張機能。',
  keywords: ['AI翻訳 拡張機能', '英語 わからない 解説', 'Chrome拡張機能 AI', '日本語翻訳', 'テキスト解説'],
  openGraph: {
    title: 'SelecText AI - 選択テキストをAIで解説・翻訳・要約',
    description: '英語テキストを選択して右クリック。AIが瞬時に日本語解説・翻訳・要約',
    url: 'https://selectext-ai-api.vercel.app',
    siteName: 'SelecText AI',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SelecText AI',
    description: '英語テキストを選択して右クリック。AIが瞬時に日本語解説・翻訳・要約',
  },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SelecText AI",
  "applicationCategory": "BrowserApplication",
  "operatingSystem": "Chrome",
  "description": "英語テキストを選択して右クリック。Claude AIが瞬時に日本語で解説・翻訳・要約します。",
  "url": "https://selectext-ai-api.vercel.app",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "9800",
    "priceCurrency": "JPY",
    "offerCount": "2",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "すき間AIとは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "選択したテキストをAIで瞬時に要約・翻訳・ビジネスメール化・法律チェックできるChrome拡張機能です。"
      }
    },
    {
      "@type": "Question",
      "name": "無料で使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、毎日10回まで無料でご利用いただけます。無制限利用はProプラン（月額¥980）をご検討ください。"
      }
    },
    {
      "@type": "Question",
      "name": "どんなテンプレートがありますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "要約・翻訳・ビジネスメール化・法律チェック・契約書チェック・SNS投稿化・英訳・確定申告・税務・医療・健康など11種類の日本語業務特化テンプレートがあります。"
      }
    },
    {
      "@type": "Question",
      "name": "プライバシーは安全ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "選択したテキストのみを送信し、ページURLや個人情報は一切送信しません。"
      }
    },
    {
      "@type": "Question",
      "name": "Chrome Web Storeから入手できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "現在Chrome Web Store審査中です。審査通過後に正式公開予定です。それまでは開発者モードでインストールいただけます。"
      }
    },
    {
      "@type": "Question",
      "name": "Proプランと無料プランの違いは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "無料プランは1日10回まで利用可能です。Proプラン（月額¥980または年額¥9,800）では無制限に利用でき、優先サポートも受けられます。"
      }
    },
    {
      "@type": "Question",
      "name": "どのブラウザに対応していますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Google Chromeに対応しています。Chrome拡張機能（Manifest V3）として動作します。"
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0f0f1a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
