window.audioSamples = [{
  title: '英语自我介绍',
  titleEn: 'English Self-Introduction',
  label: '求职面试',
  labelEn: 'Job Interview',
  src: ''
}];
window.audioSamplesReady = Promise.all(Array.from({ length: 20 }, (_, index) => {
  const part = String(index).padStart(2, '0');
  return fetch(`audio/b64/part-${part}.txt`).then((response) => {
    if (!response.ok) throw new Error('Audio segment unavailable');
    return response.text();
  });
})).then((segments) => {
  const binary = atob(segments.join('').trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  window.audioSamples[0].src = URL.createObjectURL(new Blob([bytes], { type: 'audio/mp4' }));
});
