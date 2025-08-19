// components/GlobalControlBar.js
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const GlobalControlBar = () => {
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(-10);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    // The volume value is already in decibels, so we can pass it directly
    Tone.Master.volume.value = volume;
  }, [volume]);

  return (
    <div className="bg-zinc-800 border border-purple-700 p-4 rounded-xl shadow-md">
      <h3 className="text-purple-300 font-mono text-sm mb-2">Global Controls</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 block">BPM ({bpm})</label>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block">Volume ({volume} dB)</label>
          <input
            type="range"
            min="-60"
            max="0"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalControlBar;
