import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | SelecText AI',
  description: 'SelecText AI の特定商取引法に基づく表記ページです。',
};

export default function TokushoPage() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] py-16 px-4">
      <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-8">特定商取引法に基づく表記</h1>
        <table className="w-full text-slate-300 text-sm">
          <tbody>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left w-1/3 text-slate-400">販売事業者</th>
              <td className="py-3">ポッコリラボ</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">所在地</th>
              <td className="py-3">請求があれば速やかに開示します</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">電話番号</th>
              <td className="py-3">090-6093-5290</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">メールアドレス</th>
              <td className="py-3">support@selectext-ai.com</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">販売価格</th>
              <td className="py-3">月額 ¥980（税込）/ 年額 ¥9,800（税込）</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">支払方法</th>
              <td className="py-3">クレジットカード（Stripe経由）</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">支払時期</th>
              <td className="py-3">購入手続き完了時に即時決済</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">役務の提供時期</th>
              <td className="py-3">決済完了後、即時利用可能</td>
            </tr>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left text-slate-400">返品・キャンセル</th>
              <td className="py-3">デジタルコンテンツの性質上、購入後の返金は原則お受けできません</td>
            </tr>
            <tr>
              <th className="py-3 pr-4 text-left text-slate-400">動作環境</th>
              <td className="py-3">Google Chrome（最新版）/ インターネット接続が必要</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '14px' }} aria-label="トップページに戻る">
            トップページに戻る
          </a>
        </div>
      </div>
    </main>
  );
}
