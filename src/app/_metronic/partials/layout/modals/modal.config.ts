export interface ModalConfig {
  title: string;
  onClose?(): Promise<boolean> | boolean;
  hideCloseButton: boolean;
  actions?: Array<{
    title: string,
    event(): Promise<boolean>
  }>;
}
