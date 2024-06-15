import Head from 'next/head';
const defaultTitle = 'MasterTime - Your Ultimate Time Management Companion';
const defaultDesc =
  'Unlock the power of efficient time management with MasterTime, the all-in-one app designed to elevate your productivity.';

export default function DynamicHead({
  title = defaultTitle,
  desc = defaultDesc,
  children,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta
        name='keywords'
        content='MasterTime, Master Time, Time Master, TimeMaster, Time Management'
      />
      <meta name='authur' content='Manji coder' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      {/* PWA */}
      <link rel='manifest' href='manifest.json' />
      <link rel='apple-touch-icon' href='/icon.png' />
      <meta name='theme-color' content='#fff' />
      {children}
    </Head>
  );
}
