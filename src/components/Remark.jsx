import React from 'react';

export default function Remark({ msg }) {
  if (!msg) return;
  return (
    <p className='-mt-0.5 flex max-ss:text-xs text-sm font-semibold items-center justify-center text-balance capitalize'>
      Remark :<span className='text-yellow-400 ml-1'> {msg.replace('- Others','')}</span>
    </p>
  );
}
