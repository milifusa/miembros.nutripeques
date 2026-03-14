'use client'

export default function WhatsAppBubble() {
  return (
    <a
      href="https://wa.me/5212225067864"
      target="_blank"
      rel="noopener noreferrer"
      title="Soporte por WhatsApp"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(37,211,102,0.6)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'
      }}
    >
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.822 6.5L4 29l7.703-1.797A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white"/>
        <path d="M22.003 19.274c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.687.153-.204.306-.789.995-.967 1.2-.178.204-.357.23-.663.077-.306-.153-1.291-.476-2.459-1.516-.909-.81-1.522-1.81-1.7-2.116-.178-.306-.019-.47.134-.622.137-.136.306-.357.459-.535.153-.179.204-.306.306-.51.102-.204.051-.382-.026-.535-.077-.153-.687-1.657-.941-2.269-.248-.596-.5-.515-.687-.524-.178-.009-.382-.011-.586-.011-.204 0-.535.077-.815.382-.28.306-1.07 1.046-1.07 2.55 0 1.505 1.096 2.958 1.249 3.162.153.204 2.157 3.293 5.228 4.619.731.315 1.301.503 1.746.644.733.233 1.4.2 1.927.121.588-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.127-.28-.204-.586-.357z" fill="white"/>
      </svg>
    </a>
  )
}
