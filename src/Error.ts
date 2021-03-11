export class NaviError extends Error {
  constructor(message: string) {
    super(message);
  }

  static missingDomain() {
    return new NaviError("window.naviDomain is not set");
  }
}