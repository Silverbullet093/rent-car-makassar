import React, { useState, useEffect, useRef } from 'react';

export default function IntroPreloader({ onFinish }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMerging, setIsMerging] = useState(false);

    const videoRef = useRef(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const forceIntro = params.get('intro') === '1';
            const seen = localStorage.getItem('rpm_intro_seen') || sessionStorage.getItem('rpm_intro_seen');

            if (forceIntro || !seen) {
                setIsVisible(true);
                document.documentElement.classList.add('intro-active');

                // Safety timeout: dismiss intro automatically if it stalls
                const timer = setTimeout(() => {
                    finishIntro();
                }, 4000);

                return () => clearTimeout(timer);
            } else {
                document.documentElement.classList.remove('intro-active', 'intro-merging');
                if (onFinish) onFinish();
            }
        } catch (e) {
            document.documentElement.classList.remove('intro-active', 'intro-merging');
            if (onFinish) onFinish();
        }
    }, [onFinish]);

    useEffect(() => {
        return () => {
            document.documentElement.classList.remove('intro-active', 'intro-merging');
        };
    }, []);

    const finishIntro = () => {
        if (isMerging) return;
        setIsMerging(true);
        try {
            localStorage.setItem('rpm_intro_seen', '1');
            sessionStorage.setItem('rpm_intro_seen', '1');
        } catch (e) {}

        setTimeout(() => {
            setIsVisible(false);
            document.documentElement.classList.remove('intro-active', 'intro-merging');
            if (onFinish) onFinish();
        }, 500);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime || 0;
        const duration = videoRef.current.duration || 0;
        if (duration > 0) {
            const pct = Math.min(100, (current / duration) * 100);
            setProgress(pct);

            if (duration - current <= 0.6) {
                finishIntro();
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            id="introPreloader"
            className={`intro-preloader ${isMerging ? 'is-merging' : ''}`}
            aria-label="Video Intro RPM Rent Car Makassar"
            role="dialog"
            aria-modal="true"
        >
            {/* Buffering State */}
            {!isPlaying && (
                <div id="introBufferingState" className="intro-buffering-state">
                    <div className="intro-loader-ring">
                        <img src="/logo_rpm_red.png" alt="RPM Rent Car" className="intro-loader-logo" />
                    </div>
                    <span className="intro-loader-text">Memuat Pengalaman RPM...</span>
                </div>
            )}

            {/* Video */}
            <video
                ref={videoRef}
                id="introPreloaderVideo"
                className="intro-preloader-video"
                autoPlay
                muted={isMuted}
                playsInline
                preload="auto"
                onPlaying={() => setIsPlaying(true)}
                onCanPlay={() => setIsPlaying(true)}
                onTimeUpdate={handleTimeUpdate}
                onEnded={finishIntro}
                onError={finishIntro}
            >
                <source src="/videos/intro-rpm.mp4" type="video/mp4" />
            </video>

            {/* Progress Track */}
            <div className="intro-progress-track" aria-hidden="true">
                <div id="introProgressBar" className="intro-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Controls Bar */}
            <div className="intro-controls-bar">
                <button
                    type="button"
                    id="introMuteBtn"
                    className="intro-control-pill intro-mute-btn"
                    onClick={toggleMute}
                    aria-label="Aktifkan atau bisukan suara intro"
                    title="Suara"
                >
                    <i id="introMuteIcon" className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                </button>
                <button
                    type="button"
                    id="introSkipBtn"
                    className="intro-control-pill intro-skip-btn"
                    onClick={finishIntro}
                    aria-label="Lewati video intro"
                >
                    <span>Lewati Intro</span>
                    <i className="fa-solid fa-forward-step"></i>
                </button>
            </div>
        </div>
    );
}
