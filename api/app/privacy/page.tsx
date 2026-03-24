export default function Privacy() {
  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      lineHeight: 1.8,
      color: '#e2e8f0',
      background: '#0f0f1a',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        プライバシーポリシー
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '13px' }}>
        最終更新日: 2026年3月24日
      </p>

      <p style={{ marginBottom: '24px' }}>
        SelecText AI（以下「本サービス」）は、ユーザーのプライバシーを最優先に設計されています。
        本ポリシーでは、本サービスが収集する情報・収集しない情報・データの取り扱いを明確に説明します。
      </p>

      {/* 収集するデータ */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          収集するデータ
        </h2>
        <div style={{
          padding: '16px 20px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '10px',
          marginBottom: '12px',
        }}>
          <p style={{ fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>
            収集するのは以下の情報のみです
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>選択されたテキスト</strong>
              ：ユーザーがウェブページ上で選択し、AI解析を要求したテキストのみ。AI処理のためサーバーに送信されます。
            </li>
            <li>
              <strong>利用回数（ローカル保存）</strong>
              ：無料プランの上限管理のため、1日の使用回数をお使いのデバイス内（chrome.storage.local）にのみ保存します。外部サーバーへは送信しません。
            </li>
          </ul>
        </div>
      </section>

      {/* 収集しないデータ */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          収集しないデータ
        </h2>
        <div style={{
          padding: '16px 20px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '10px',
        }}>
          <p style={{ fontWeight: 600, color: '#f87171', marginBottom: '8px' }}>
            以下の情報は一切収集・送信しません
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>URL・ページタイトル</strong>：閲覧中のページのURLやタイトルは送信しません</li>
            <li><strong>ブラウジング履歴</strong>：訪問したウェブサイトの履歴は一切収集しません</li>
            <li><strong>個人情報</strong>：氏名・メールアドレス・住所等の個人を特定できる情報は収集しません</li>
            <li><strong>Cookie・フィンガープリント</strong>：ユーザーを追跡するためのCookieや端末情報は収集しません</li>
            <li><strong>ページ全体のコンテンツ</strong>：ユーザーが選択していないテキストは送信しません</li>
          </ul>
        </div>
      </section>

      {/* データ保存期間 */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          データ保存期間
        </h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>
            <strong>送信テキスト</strong>
            ：AI解析処理完了後、サーバー上から即時削除します。セッション終了後にデータは残りません。
          </li>
          <li>
            <strong>利用回数カウント</strong>
            ：毎日0時にリセットされます。お使いのデバイス内のみに保存され、外部には送信しません。
          </li>
        </ul>
      </section>

      {/* 第三者提供 */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          第三者への提供
        </h2>
        <p>
          ユーザーの選択テキストを含むいかなるデータも、第三者（広告会社・データブローカー・分析サービス等）に提供・販売・共有することは一切ありません。
          AI解析に使用するAnthropicのAPIについては、
          <a
            href="https://www.anthropic.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6366f1' }}
          >
            Anthropic プライバシーポリシー
          </a>
          をご参照ください。
        </p>
      </section>

      {/* データの安全性 */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          データの安全性
        </h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>サーバーとの通信はすべてHTTPS（TLS暗号化）で行われます</li>
          <li>送信テキストはAI処理以外の目的には使用しません</li>
          <li>拡張機能のローカルデータはChromeのセキュリティ機能により保護されます</li>
        </ul>
      </section>

      {/* お問い合わせ */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#6366f1' }}>
          お問い合わせ
        </h2>
        <p>
          プライバシーに関するご質問・ご懸念は、X（旧Twitter）よりお問い合わせください。
        </p>
        <p style={{ marginTop: '8px' }}>
          X:{' '}
          <a href="https://twitter.com/levona_design" style={{ color: '#6366f1' }}>
            @levona_design
          </a>
        </p>
      </section>

      <p style={{ marginTop: '24px' }}>
        <a href="/" style={{ color: '#6366f1' }}>
          トップに戻る
        </a>
      </p>
    </div>
  );
}
