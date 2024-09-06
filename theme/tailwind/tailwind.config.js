/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["../templates/**/*.templ", "../static/home.js"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "auto-1fr": "auto 1fr",
      },

      fontFamily: {
        firasans: ['"Fira Sans"', "sans"],
        firamono: ['"Fira Mono"', "monospace"],
      },

      keyframes: {
        fill: {
          "0%": { "clip-path": "inset(0 0 0 100%)" },
          "10%": { "clip-path": "inset(0 0 0 0)" },
          "15%": { "clip-path": "inset(0 0 0 0)" },
          "50%": { "clip-path": "inset(0 0 0 100%)" },
          "70%": { "clip-path": "inset(0 0 0 0)" },
          "100%": { "clip-path": "inset(0 0 0 100%)" },
        },

        "slide-lr": {
          "0%": {
            transform: "translateX(-1rem)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },

        "slide-rl": {
          "0%": {
            transform: "translateX(1rem)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },

        "slide-bt": {
          "0%": {
            transform: "translateY(1rem)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },

        scale: {
          "0%": {
            transform: "scale(.8)",
            opacity: 0,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      },

      animation: {
        fill: "6s 1s ease fill infinite",
        "slide-1": "1s ease slide-lr forwards",
        "slide-2": "1s 0.25s ease slide-rl forwards",
        "slide-3": "1s 0.5s ease slide-lr forwards",
        "slide-4": "1s 0.75s ease slide-bt forwards",
        "slide-5": "0.5s ease slide-bt forwards",
      },
    },
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".writing-v": {
          "writing-mode": "vertical-rl",
        },
        ".grayscale-60": {
          filter: "grayscale(60%)",
        },
        ".stroke-2-transparent": {
          "-webkit-text-stroke": "0.1rem transparent",
        },
        ".animation-stop": {
          "animation-play-state": "paused",
        },
        ".clip-path-full": {
          "clip-path": "inset(0 0 0 100%)",
        },
      });
    }),
  ],
};
