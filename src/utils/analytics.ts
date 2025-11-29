// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined' || !measurementId) return;

  // Create script element
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.VITE_GA_MEASUREMENT_ID || '', {
    page_path: path,
    page_title: title || document.title,
  });
};

// Track events
export const trackEvent = (
  eventName: string,
  eventParams?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
  });
};

// Predefined event trackers
export const analytics = {
  // Authentication events
  signUp: (method: string = 'email') => {
    trackEvent('sign_up', {
      method,
      category: 'Authentication',
    });
  },

  login: (method: string = 'email') => {
    trackEvent('login', {
      method,
      category: 'Authentication',
    });
  },

  logout: () => {
    trackEvent('logout', {
      category: 'Authentication',
    });
  },

  // OTP events
  otpRequested: (email: string) => {
    trackEvent('otp_requested', {
      category: 'Authentication',
      label: 'OTP Request',
    });
  },

  otpVerified: (success: boolean) => {
    trackEvent('otp_verified', {
      category: 'Authentication',
      success: success ? 'yes' : 'no',
    });
  },

  // Product events
  viewProduct: (productId: string, productName: string) => {
    trackEvent('view_item', {
      category: 'Ecommerce',
      item_id: productId,
      item_name: productName,
    });
  },

  addToCart: (productId: string, productName: string, quantity: number, price: number) => {
    trackEvent('add_to_cart', {
      category: 'Ecommerce',
      currency: 'INR',
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          quantity,
          price,
        },
      ],
    });
  },

  // Order events
  beginCheckout: (value: number, items: Array<{ id: string; name: string; quantity: number; price: number }>) => {
    trackEvent('begin_checkout', {
      category: 'Ecommerce',
      currency: 'INR',
      value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  },

  purchase: (transactionId: string, value: number, items: Array<{ id: string; name: string; quantity: number; price: number }>) => {
    trackEvent('purchase', {
      category: 'Ecommerce',
      transaction_id: transactionId,
      currency: 'INR',
      value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  },

  // User engagement
  resendOTP: () => {
    trackEvent('resend_otp', {
      category: 'User Engagement',
    });
  },

  // Error tracking
  error: (errorMessage: string, errorType: string = 'general') => {
    trackEvent('exception', {
      description: errorMessage,
      fatal: false,
      category: 'Error',
      error_type: errorType,
    });
  },
};

