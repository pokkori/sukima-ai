// Jest mock for extpay
const ExtPay = jest.fn(() => ({
  startBackground: jest.fn(),
  openPaymentPage: jest.fn(() => Promise.resolve()),
  openLoginPage: jest.fn(() => Promise.resolve()),
  openTrialPage: jest.fn(() => Promise.resolve()),
  getUser: jest.fn(() => Promise.resolve({ paid: false, paidAt: null, email: null, installedAt: new Date(), trialStartedAt: null, plan: null })),
  getPlans: jest.fn(() => Promise.resolve([])),
  onPaid: { addListener: jest.fn() },
  onTrialStarted: { addListener: jest.fn() },
}));

export default ExtPay;
