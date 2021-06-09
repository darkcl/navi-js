export default class InvalidInputError extends Error {
  constructor(msg: any) {
    super(msg);
    this.name = "InvalidInputError";
  }
}
