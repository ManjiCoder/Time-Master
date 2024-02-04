import Head from 'next/head';
import React from 'react';

export default function CustomHead({ title = null, desc = null }) {
  return (
    <Head>
      <title>
        {title || 'MasterTime - Your Ultimate Time Management Companion'}
      </title>
      <meta
        name='description'
        content={
          desc ||
          'Unlock the power of efficient time management with MasterTime, the all-in-one app designed to elevate your productivity.'
        }
      />
      <meta
        name='keywords'
        content='MasterTime, Master Time, Time Master, TimeMaster, Time Management'
      />
      <meta
        name='authur'
        content='Manji coder'
      />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      {/* <link
        rel='icon'
        href='/favicon.ico'
      /> */}

      {/* PWA */}
      <link
        rel='manifest'
        href='manifest.json'
      />
      <link
        rel='apple-touch-icon'
        href='/icon.png'
      />
      <meta
        name='theme-color'
        content='#fff'
      />
    </Head>
  );
}

// Refference

/* <head>
  <meta charSet='utf-8' />
  <title>Coding Journal </title>
  <meta
    name='description'
    content='Coding Journal for Coders made by a Coder!'
  />
  <meta name='keywords' content='Next.Js, React.Js, Coding-Journal, Redux' />
  <meta name='authur' content='Manji coder' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <link rel='icon' href='/favicon.ico' />
  <meta name='next-head-count' content='7' />
  <link
    rel='preload'
    href='/_next/static/css/9b8c19a0a7fda66e.css'
    as='style'
  />
  <link
    rel='stylesheet'
    href='/_next/static/css/9b8c19a0a7fda66e.css'
    data-n-g=''
  />
  <noscript data-n-css=''></noscript>
  <script
    defer=''
    nomodule=''
    src='/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js'
  ></script>
  <script
    src='/_next/static/chunks/webpack-445a5fe7cadeec28.js'
    defer=''
  ></script>
  <script
    src='/_next/static/chunks/framework-467b11a89995b152.js'
    defer=''
  ></script>
  <script src='/_next/static/chunks/main-d16697bd9f30178f.js' defer=''></script>
  <script
    src='/_next/static/chunks/pages/_app-7881458a40639ff3.js'
    defer=''
  ></script>
  <script
    src='/_next/static/chunks/0c428ae2-afc10c6c977b8000.js'
    defer=''
  ></script>
  <script src='/_next/static/chunks/809-4b6db447f96150c6.js' defer=''></script>
  <script src='/_next/static/chunks/481-13b1cab146e3a4d9.js' defer=''></script>
  <script
    src='/_next/static/chunks/pages/index-cd4364bf0f38c56d.js'
    defer=''
  ></script>
  <script
    src='/_next/static/E54DpSeg9iw2lPGC0-XKv/_buildManifest.js'
    defer=''
  ></script>
  <script
    src='/_next/static/E54DpSeg9iw2lPGC0-XKv/_ssgManifest.js'
    defer=''
  ></script>
</head>; */
