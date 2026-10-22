// Next.js drops its built-in PostCSS setup as soon as this file exists, so its
// two default plugins are listed again after Tailwind: the exact copies Next
// ships, with the same options, to keep vendor prefixes and fixes on the
// hand-written CSS (-webkit-clip-path, -webkit-backdrop-filter, ...). Targets
// are Next's own defaults; update them here too if a browserslist is added.
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "next/dist/compiled/postcss-flexbugs-fixes": {},
    "next/dist/compiled/postcss-preset-env": {
      browsers: require("next/dist/shared/lib/modern-browserslist-target"),
      autoprefixer: { flexbox: "no-2009" },
      stage: 3,
      features: { "custom-properties": false }
    }
  }
};
