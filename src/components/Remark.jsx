import React from 'react';

export default function Remark({ msg }) {
  if (!msg) return;
  return (
    <p className='-mt-0.5 flex items-center justify-center text-balance text-sm font-semibold capitalize max-ss:text-xs'>
      Remark :
      <span className='ml-1 text-yellow-400'>
        {' '}
        {msg.replace('- Others', '')}
      </span>
    </p>
  );
}
