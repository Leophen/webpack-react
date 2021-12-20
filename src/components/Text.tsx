import React from 'react';
import './Text.scss';
import axios from 'axios';

function Text() {
  const getMusic = async (name: string) => {
    const res = await axios.get(`https://api.apiopen.top/searchMusic?name=${name}`)
    console.log(res)
  }
  return (
    <div className="text">
      <div className="purple-text">Text</div>
      <div className="orange-text">Text</div>
      <button onClick={() => getMusic('黑色毛衣')}>get music</button>
    </div>
  );
}

export default Text;
