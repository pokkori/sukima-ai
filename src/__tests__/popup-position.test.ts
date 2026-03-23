import { calculatePopupPosition } from '../content';

const POPUP_WIDTH = 360;
const POPUP_HEIGHT = 400;
const WIN_WIDTH = 1280;
const WIN_HEIGHT = 800;

describe('calculatePopupPosition', () => {
  test('1. 通常位置: ポップアップが画面内に収まる', () => {
    const pos = calculatePopupPosition(200, 300, WIN_WIDTH, WIN_HEIGHT, POPUP_WIDTH, POPUP_HEIGHT);

    expect(pos.x).toBeGreaterThanOrEqual(8);
    expect(pos.y).toBeGreaterThanOrEqual(8);
    expect(pos.x + POPUP_WIDTH).toBeLessThanOrEqual(WIN_WIDTH);
    expect(pos.y + POPUP_HEIGHT).toBeLessThanOrEqual(WIN_HEIGHT);
  });

  test('2. 右端クリック: x座標が window.innerWidth - popupWidth 以下に補正される', () => {
    // 画面右端近くをクリック
    const pos = calculatePopupPosition(WIN_WIDTH - 10, 300, WIN_WIDTH, WIN_HEIGHT, POPUP_WIDTH, POPUP_HEIGHT);

    expect(pos.x + POPUP_WIDTH).toBeLessThanOrEqual(WIN_WIDTH);
    expect(pos.x).toBeLessThanOrEqual(WIN_WIDTH - POPUP_WIDTH);
  });

  test('3. 下端クリック: y座標が window.innerHeight - popupHeight 以下に補正される', () => {
    // 画面下端近くをクリック
    const pos = calculatePopupPosition(200, WIN_HEIGHT - 10, WIN_WIDTH, WIN_HEIGHT, POPUP_WIDTH, POPUP_HEIGHT);

    expect(pos.y + POPUP_HEIGHT).toBeLessThanOrEqual(WIN_HEIGHT);
    expect(pos.y).toBeLessThanOrEqual(WIN_HEIGHT - POPUP_HEIGHT);
  });
});
