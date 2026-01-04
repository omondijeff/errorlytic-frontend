/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Keep Tajilabs colors for branding
        tajilabs: {
          primary: "#E05426",
          secondary: "#FFAB88",
        },
      },
      fontFamily: {
        "sf-pro": [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        "sf-pro-text": [
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "ios-large": ["34px", { lineHeight: "40px", fontWeight: "700" }],
        "ios-title1": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "ios-title2": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "ios-title3": ["20px", { lineHeight: "25px", fontWeight: "600" }],
        "ios-headline": ["17px", { lineHeight: "22px", fontWeight: "600" }],
        "ios-body": ["17px", { lineHeight: "22px", fontWeight: "400" }],
        "ios-callout": ["16px", { lineHeight: "21px", fontWeight: "400" }],
        "ios-subhead": ["15px", { lineHeight: "20px", fontWeight: "400" }],
        "ios-footnote": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "ios-caption1": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "ios-caption2": ["11px", { lineHeight: "13px", fontWeight: "400" }],
      },
      borderRadius: {
        ios: "12px",
        "ios-lg": "16px",
        "ios-xl": "20px",
      },
      boxShadow: {
        ios: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "ios-lg": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "ios-xl": "0 8px 25px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "ios-bounce": "iosBounce 0.3s ease-out",
        "ios-fade-in": "iosFadeIn 0.3s ease-out",
        "ios-slide-up": "iosSlideUp 0.3s ease-out",
        "ios-slide-down": "iosSlideDown 0.3s ease-out",
        // Garage-themed animations
        "engine-start": "engineStart 2s ease-in-out",
        "diagnostic-scan": "diagnosticScan 3s ease-in-out infinite",
        "oil-drip": "oilDrip 4s ease-in-out infinite",
        "spark-plug": "sparkPlug 0.5s ease-in-out infinite",
        "tire-rotation": "tireRotation 2s linear infinite",
        "garage-door": "garageDoor 1.5s ease-in-out",
        "wrench-turn": "wrenchTurn 0.8s ease-in-out",
        "dashboard-glow": "dashboardGlow 2s ease-in-out infinite",
        "error-flash": "errorFlash 0.3s ease-in-out",
        "success-check": "successCheck 0.6s ease-in-out",
        "loading-gear": "loadingGear 1s linear infinite",
        "scan-wave": "scanWave 2s ease-in-out infinite",
        // Modern background animations
        "floating-bg": "floatingBg 20s ease-in-out infinite",
        "mesh-move": "meshMove 15s ease-in-out infinite",
        "aurora-shift": "auroraShift 25s ease-in-out infinite",
        "particle-float": "particleFloat 8s ease-in-out infinite",
        "gradient-shift": "gradientShift 10s ease-in-out infinite",
        "blob-morph": "blobMorph 12s ease-in-out infinite",
      },
      keyframes: {
        iosBounce: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        iosFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        iosSlideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        iosSlideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Garage-themed keyframes
        engineStart: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "25%": { transform: "scale(1.1)", opacity: "0.8" },
          "50%": { transform: "scale(0.95)", opacity: "1" },
          "75%": { transform: "scale(1.05)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        diagnosticScan: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { transform: "translateX(0%)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        oilDrip: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "50%": { transform: "translateY(0px)", opacity: "1" },
          "100%": { transform: "translateY(10px)", opacity: "0" },
        },
        sparkPlug: {
          "0%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.1)", filter: "brightness(1.5)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        tireRotation: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        garageDoor: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0%)" },
        },
        wrenchTurn: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(90deg)" },
          "50%": { transform: "rotate(180deg)" },
          "75%": { transform: "rotate(270deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        dashboardGlow: {
          "0%": { boxShadow: "0 0 5px rgba(224, 84, 38, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(224, 84, 38, 0.8)" },
          "100%": { boxShadow: "0 0 5px rgba(224, 84, 38, 0.3)" },
        },
        errorFlash: {
          "0%": { backgroundColor: "rgba(255, 59, 48, 0)" },
          "50%": { backgroundColor: "rgba(255, 59, 48, 0.3)" },
          "100%": { backgroundColor: "rgba(255, 59, 48, 0)" },
        },
        successCheck: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        loadingGear: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scanWave: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "50%": { transform: "scaleX(1)", opacity: "1" },
          "100%": { transform: "scaleX(0)", opacity: "0" },
        },
        // Modern background keyframes
        floatingBg: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-30px) rotate(120deg)" },
          "66%": { transform: "translateY(15px) rotate(240deg)" },
        },
        meshMove: {
          "0%": { transform: "translateX(0%) translateY(0%)" },
          "25%": { transform: "translateX(100%) translateY(0%)" },
          "50%": { transform: "translateX(100%) translateY(100%)" },
          "75%": { transform: "translateX(0%) translateY(100%)" },
          "100%": { transform: "translateX(0%) translateY(0%)" },
        },
        auroraShift: {
          "0%": { transform: "translateX(-50%) translateY(-50%) rotate(0deg)" },
          "50%": {
            transform: "translateX(50%) translateY(50%) rotate(180deg)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-50%) rotate(360deg)",
          },
        },
        particleFloat: {
          "0%, 100%": { transform: "translateY(0px) scale(1)", opacity: "0.7" },
          "50%": { transform: "translateY(-20px) scale(1.1)", opacity: "1" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        blobMorph: {
          "0%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
        },
      },
      zIndex: {
        modal: "1000",
        dropdown: "100",
        overlay: "50",
        header: "40",
        sidebar: "30",
        floating: "20",
        base: "10",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "aurora-gradient":
          "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
