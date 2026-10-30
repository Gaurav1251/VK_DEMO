import { createContext, useContext } from 'react';

export const EnquiryModalContext = createContext({ open: () => {}, close: () => {} });
export const useEnquiryModal = () => useContext(EnquiryModalContext);
