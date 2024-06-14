import dynamic from 'next/dynamic';

const lazy = (importFunc) => dynamic(importFunc, { ssr: false });

export default lazy;