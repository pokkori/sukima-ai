export interface Preset {
  id: string;
  label: string;
  description: string;
  color: string;
  systemPrompt: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'explain',
    label: '解説',
    description: '選択テキストをわかりやすく日本語で解説します',
    color: '#3b82f6',
    systemPrompt:
      '以下のテキストを、日本人のビジネスパーソン向けにわかりやすく解説してください。専門用語は噛み砕いて説明し、200文字以内でまとめてください。',
  },
  {
    id: 'translate',
    label: '英→日翻訳',
    description: '英語→日本語（自然な日本語）に翻訳します',
    color: '#10b981',
    systemPrompt:
      '以下の英語テキストを自然な日本語に翻訳してください。直訳でなく、日本語として読みやすい表現にしてください。',
  },
  {
    id: 'translate_ja_en',
    label: '日→英翻訳',
    description: '日本語→英語（ビジネス敬語）に翻訳します',
    color: '#059669',
    systemPrompt:
      '以下の日本語テキストを、ビジネスシーンで使用できる丁寧な英語に翻訳してください。自然で読みやすい英文を心がけてください。',
  },
  {
    id: 'summarize',
    label: 'ニュース要約',
    description: '選択した記事・文章を3行で要約します',
    color: '#8b5cf6',
    systemPrompt:
      '以下のテキストを3行以内で日本語要約してください。各行は「・」で始め、最も重要な情報を優先してください。',
  },
  {
    id: 'legal',
    label: '法律相談',
    description: '法的観点でテキストを解説します',
    color: '#ef4444',
    systemPrompt:
      '以下のテキストを法的観点から解説してください。関連する法律・条文があれば言及し、一般市民にもわかりやすい言葉で説明してください。なお、これは一般的な情報提供であり、個別の法律相談ではありません。',
  },
  {
    id: 'medical',
    label: '医療情報',
    description: '医学用語をわかりやすく説明します',
    color: '#ec4899',
    systemPrompt:
      '以下のテキストに含まれる医学用語や医療情報を、医療の専門知識がない一般の方にもわかりやすく説明してください。なお、これは一般的な情報提供であり、診断・治療の代替ではありません。',
  },
  {
    id: 'business_email',
    label: 'メール返信',
    description: '選択テキストへのビジネスメール返信文を作成します',
    color: '#6366f1',
    systemPrompt:
      '以下のテキストに対する、丁寧なビジネスメール返信文を日本語で作成してください。件名（Re:...）、挨拶、本文、締めの言葉を含めた完全なメール形式で出力してください。',
  },
  {
    id: 'contract_check',
    label: '契約書チェック',
    description: '契約書のリスク箇所を指摘します',
    color: '#f97316',
    systemPrompt:
      '以下の契約書・規約テキストについて、ビジネスリスクになりうる箇所や注意すべき条項を指摘してください。不利な条件・曖昧な表現・一般的でない条項を優先して箇条書きで説明してください。なお、これは一般的な情報提供であり、法律専門家への相談の代替ではありません。',
  },
  {
    id: 'sns',
    label: 'SNS投稿変換',
    description: 'X（Twitter）向けの投稿文に変換します',
    color: '#0ea5e9',
    systemPrompt:
      '以下のテキストをX（旧Twitter）向けの投稿文に変換してください。140文字以内にまとめ、読者の興味を引く書き出し・適切なハッシュタグ（最大3個）を付けてください。元のテキストの要点は維持してください。',
  },
];

/** IDでプリセットを取得する（見つからない場合は explain を返す） */
export function getPresetById(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}
