export interface ModalConfig {
  title: string;
  onClose?(): Promise<boolean> | boolean;
  hideCloseButton: boolean;
  actions?: Array<{
    title: string,
    buttonClass?: 'primary' | 'success' | 'danger',
    event(): Promise<boolean>
  }>;
}
