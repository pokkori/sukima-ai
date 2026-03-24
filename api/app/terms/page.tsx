import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | すき間AI',
  description: 'Chrome拡張機能「すき間AI」の利用規約です。',
};

export default function Terms() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#e2e8f0', background: '#0f0f1a', minHeight: '100vh' }}>
      <h1>利用規約</h1>
      <p>SelecText AI（以下「本サービス」）をご利用いただくにあたり、以下の利用規約に同意いただく必要があります。</p>
      <h2>サービスの利用</h2>
      <p>本サービスは、Webページ上の英語テキストをAIで解説・翻訳・要約するChrome拡張機能です。無料プランは1日10回まで利用できます。</p>
      <h2>禁止事項</h2>
      <ul>
        <li>違法なコンテンツの処理</li>
        <li>本サービスのリバースエンジニアリング</li>
        <li>他のユーザーへの迷惑行為</li>
      </ul>
      <h2>免責事項</h2>
      <p>AIによる解説・翻訳・要約の精度は保証しません。重要な判断には必ず専門家にご確認ください。</p>
      <p style={{ marginTop: '24px' }}>
        特定商取引法に基づく表記は
        <a href="/tokusho" style={{ color: '#6366f1', marginLeft: '4px', marginRight: '4px' }}>こちら</a>
        をご確認ください。
      </p>
      <p style={{ marginTop: '16px' }}><a href="/" style={{ color: '#6366f1' }}>トップに戻る</a></p>
    </div>
  );
}
