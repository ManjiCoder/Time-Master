import Head from 'next/head';
import React from 'react';

export default function CustomHead({ title = null, desc = null }) {
  return (
    <Head>
      <title>
        {title || 'MasterTime - Your Ultimate Time Management Companion'}
      </title>
      <meta
        name="description"
        content={
          desc ||
          'Unlock the power of efficient time management with MasterTime, the all-in-one app designed to elevate your productivity.'
        }
      />
      <meta
        name="keywords"
        content="MasterTime, Master Time, Time Master, TimeMaster, Time Management"
      />
      <meta name="authur" content="Manji coder" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://mastertime.vercel.app" />
    </Head>
  );
}
