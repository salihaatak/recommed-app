export class ResultModel {
  data: any;
  message: string;
  messageCode: string;
  success: string;

  setAuth(model: ResultModel) {
    this.data = model.data;
    this.message = model.message;
    this.messageCode = model.messageCode;
    this.success = model.success;
  }
}
