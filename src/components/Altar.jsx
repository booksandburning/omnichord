// Altar.jsx
import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import SamplerPanel from './SamplerPanel';

// For OscillatorPanel, define a basic placeholder if it doesn't exist
const OscillatorPanel = ({ oscId, onChange }) => (
  <div className="bg-zinc-800 border border-blue-700 p-4 rounded-xl shadow-md">
    <h3 className="text-blue-300 font-mono text-sm mb-2">Oscillator {oscId}</h3>
    <div className="space-y-2">
      <select 
        className="bg-zinc-900 text-white text-xs p-1 rounded w-full mb-2"
        onChange={e => onChange({ waveform: e.target.value })}
        defaultValue="sine"
      >
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
      <div>
        <label className="text-xs text-gray-400 block">Detune</label>
        <input 
          type="range" 
          min="-50" 
          max="50" 
          defaultValue="0"
          onChange={e => onChange({ detune: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 block">Octave</label>
        <input 
          type="range" 
          min="-2" 
          max="2" 
          defaultValue="0"
          step="1"
          onChange={e => onChange({ octave: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  </div>
);

// Define a basic TransportPanel placeholder
const TransportPanel = () => (
  <div className="bg-zinc-800 border border-green-700 p-4 rounded-xl shadow-md mt-4">
    <h3 className="text-green-300 font-mono text-sm mb-2">Transport Panel</h3>
    <div className="grid grid-cols-3 gap-2">
      <button className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">Play</button>
      <button className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Stop</button>
      <button className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">Reset</button>
    </div>
  </div>
);

// Define a basic SynthSequencer placeholder
const SynthSequencer = () => (
  <div className="bg-zinc-800 border border-yellow-700 p-4 rounded-xl shadow-md mt-4">
    <h3 className="text-yellow-300 font-mono text-sm mb-2">Synth Sequencer</h3>
    <div className="grid grid-cols-8 gap-1">
      {[...Array(8)].map((_, i) => (
        <button 
          key={i}
          className="bg-zinc-700 hover:bg-yellow-600 h-12 rounded-sm"
        ></button>
      ))}
    </div>
  </div>
);

// Define a basic GlobalControlBar placeholder
const GlobalControlBar = () => (
  <div className="bg-zinc-800 border border-purple-700 p-4 rounded-xl shadow-md">
    <h3 className="text-purple-300 font-mono text-sm mb-2">Global Controls</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-400 block">BPM</label>
        <input type="range" min="60" max="180" defaultValue="120" className="w-full" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block">Volume</label>
        <input type="range" min="-60" max="0" defaultValue="-10" className="w-full" />
      </div>
    </div>
  </div>
);

const Altar = () => {
  const [osc1Settings, setOsc1Settings] = useState({ waveform: 'sine', detune: 0, octave: 0 });
  const [osc2Settings, setOsc2Settings] = useState({ waveform: 'sine', detune: 0, octave: 0 });
  const [samplePlayer, setSamplePlayer] = useState(null);
  const [osc1, setOsc1] = useState(null);
  const [osc2, setOsc2] = useState(null);

  useEffect(() => {
    const o1 = new Tone.Oscillator({
      type: osc1Settings.waveform,
      frequency: 440 * Math.pow(2, osc1Settings.octave),
      detune: osc1Settings.detune
    }).start();
    const o2 = new Tone.Oscillator({
      type: osc2Settings.waveform,
      frequency: 220 * Math.pow(2, osc2Settings.octave),
      detune: osc2Settings.detune
    }).start();
    o1.toDestination();
    o2.toDestination();
    setOsc1(o1);
    setOsc2(o2);
    return () => {
      o1.dispose();
      o2.dispose();
    };
  }, [osc1Settings, osc2Settings]);

  const updateOscillator = (oscNum, settings) => {
    if (oscNum === 1) setOsc1Settings(prevSettings => ({ ...prevSettings, ...settings }));
    if (oscNum === 2) setOsc2Settings(prevSettings => ({ ...prevSettings, ...settings }));
  };

  const handleSampleChange = (url) => {
    if (samplePlayer) samplePlayer.dispose();
    const player = new Tone.Player(url).toDestination();
    player.autostart = false;
    setSamplePlayer(player);
  };

  const triggerSample = () => {
    if (samplePlayer) samplePlayer.start();
  };

  return (
    <div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-fuchsia-500 font-mono">🜃 Omnichord Altar</h1>

      <GlobalControlBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OscillatorPanel oscId={1} onChange={(settings) => updateOscillator(1, settings)} />
        <OscillatorPanel oscId={2} onChange={(settings) => updateOscillator(2, settings)} />
      </div>

      {/* Comment out missing components */}
      {/* <Oscilloscope osc1={osc1} osc2={osc2} /> */}
      <SynthSequencer osc1={osc1} osc2={osc2} />
      <SamplerPanel onSampleChange={handleSampleChange} />
      <TransportPanel />
      {/* <FXRack input={null} perChannel={testDrumPlayers} /> */}

      <button
        onClick={triggerSample}
        className="mt-4 bg-purple-700 hover:bg-purple-600 transition px-4 py-2 rounded shadow font-mono text-sm"
      >
        ✴ Play Sample ✴
      </button>
    </div>
  );
};

export default Altar;