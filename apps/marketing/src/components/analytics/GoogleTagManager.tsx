const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5GWN244W';

function isGtmEnabled(): boolean {
  return process.env.NODE_ENV === 'production';
}

/** Paste as high in `<head>` as possible (Google Tag Manager). */
export function GoogleTagManagerHead() {
  if (!isGtmEnabled()) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  );
}

/** Paste immediately after the opening `<body>` tag. */
export function GoogleTagManagerBody() {
  if (!isGtmEnabled()) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
