import { ToastProvider } from '@/components/ui/Toast'
import CmsWrap from './CmsWrap'

export const metadata = {
  robots: { index: false, follow: false },
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CmsWrap>{children}</CmsWrap>
    </ToastProvider>
  )
}
