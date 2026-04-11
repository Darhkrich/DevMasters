import TiltScriptLoader from '@/components/common/TiltscriptLoader'
import '@/styles/public.css'

// This should be at the top level of your layout.js
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Optional: prevents auto-zoom on input focus in iOS
}



export default function PublicLayout({ children }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <main>{children}</main>
    </>
  )
}
