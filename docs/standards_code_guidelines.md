```
  # DONT DO THIS!
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setActiveWave((prev) => (prev === 0 ? 3 : prev - 1));
    }, 200);
    return () => clearInterval(waveInterval);
  }, []);

  useEffect(() => {
    if (messageIndex < messages.length - 1) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setMessageIndex((prev) => prev + 1);
          setFade(true);
        }, 300);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [messageIndex, messages.length]);

  # DO THIS INSTEAD

  // 1. Constants: Descriptive Nouns (Adjective-Noun) define the "What"
  const WAVE_TICK_MS = 200;
  const MAX_WAVES = 3;
  const MESSAGE_DURATION_MS = 2000;
  const FADE_MS = 300;

  /**
   * 2. Local Action Functions: Descriptive Verbs define the "How"
   * These encapsulate implementation details, leaving the hooks to read like 
   * a high-level story of the component's lifecycle.
   */
  const animateWaveCycle = () => {
    setActiveWave((wave_index) => (wave_index === 0 ? MAX_WAVES : wave_index - 1));
  };

  const rotateToNextMessage = () => {
    const startFadeOut = () => setFade(false);
    const updateContent = () => setMessageIndex((prev) => prev + 1);
    const startFadeIn = () => setFade(true);

    startFadeOut();
    setTimeout(() => {
      updateContent();
      startFadeIn();
    }, FADE_MS);
  };

  /**
   * 3. Effects: Orchestrate the "Story"
   * The naming of the effect functions (syncX, handleY) adds another layer
   * of self-documentation to the React DevTools.
   */
  useEffect(function syncWaveAnimation() {
    const animationHeartbeat = setInterval(animateWaveCycle, WAVE_TICK_MS);
    return () => clearInterval(animationHeartbeat);
  }, []);

  useEffect(function handleMessageRotation() {
    const hasMoreMessages = messageIndex < messages.length - 1;
    if (!hasMoreMessages) return;

    const rotationTimer = setTimeout(rotateToNextMessage, MESSAGE_DURATION_MS);
    return () => clearTimeout(rotationTimer);
  }, [messageIndex, messages.length]);
```