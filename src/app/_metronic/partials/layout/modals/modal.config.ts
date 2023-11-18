export interface ModalConfig {
  title: string;
  onClose?(): Promise<boolean> | boolean;
  hideCloseButton?(): boolean;
  actions?: [{
    title: string,
    event(): Promise<boolean>
  }];
}
