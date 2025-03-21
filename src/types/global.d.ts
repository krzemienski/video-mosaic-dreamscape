
// Global type declarations for window object with Google Analytics
interface Window {
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
}
