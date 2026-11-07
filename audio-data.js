window.audioSamples = [{
  title: '英语自我介绍',
  titleEn: 'English Self-Introduction',
  label: '求职面试',
  labelEn: 'Job Interview',
  src: ''
}];
window.audioSamplesReady = fetch('audio/english-self-introduction.m4a.base64')
  .then((response) => { if (!response.ok) throw new Error('Audio not found'); return response.text(); })
  .then((encoded) => {
    const binary = atob(encoded.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    window.audioSamples[0].src = URL.createObjectURL(new Blob([bytes], { type: 'audio/mp4' }));
  });
