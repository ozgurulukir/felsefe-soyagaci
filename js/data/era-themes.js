const RAW_ERA_THEMES = Object.freeze({
  dark: {
    "antik": {
      "background": "#1e293b",
      "border": "#f59e0b",
      "highlight": {
        "background": "#b45309",
        "border": "#fbbf24"
      },
      "color": "#fef3c7",
      "badgeClass": "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    "helenistik": {
      "background": "#132e27",
      "border": "#10b981",
      "highlight": {
        "background": "#047857",
        "border": "#34d399"
      },
      "color": "#d1fae5",
      "badgeClass": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    "ortacag": {
      "background": "#0c2b3e",
      "border": "#0284c7",
      "highlight": {
        "background": "#0369a1",
        "border": "#38bdf8"
      },
      "color": "#e0f2fe",
      "badgeClass": "bg-sky-500/20 text-sky-300 border-sky-500/30"
    },
    "aydinlanma": {
      "background": "#231e3d",
      "border": "#8b5cf6",
      "highlight": {
        "background": "#6d28d9",
        "border": "#a78bfa"
      },
      "color": "#ede9fe",
      "badgeClass": "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    "19yy": {
      "background": "#371826",
      "border": "#f43f5e",
      "highlight": {
        "background": "#be123c",
        "border": "#fb7185"
      },
      "color": "#ffe4e6",
      "badgeClass": "bg-rose-500/20 text-rose-300 border-rose-500/30"
    },
    "20yy": {
      "background": "#342111",
      "border": "#f97316",
      "highlight": {
        "background": "#c2410c",
        "border": "#fb923c"
      },
      "color": "#ffedd5",
      "badgeClass": "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }
  },
  light: {
    "antik": {
      "background": "#fffbeb",
      "border": "#d97706",
      "highlight": {
        "background": "#fef3c7",
        "border": "#b45309"
      },
      "color": "#451a03",
      "badgeClass": "bg-amber-100 text-amber-900 border-amber-300"
    },
    "helenistik": {
      "background": "#f0fdf4",
      "border": "#059669",
      "highlight": {
        "background": "#dcfce7",
        "border": "#047857"
      },
      "color": "#064e3b",
      "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-300"
    },
    "ortacag": {
      "background": "#f0f9ff",
      "border": "#0284c7",
      "highlight": {
        "background": "#e0f2fe",
        "border": "#0369a1"
      },
      "color": "#082f49",
      "badgeClass": "bg-sky-100 text-sky-900 border-sky-300"
    },
    "aydinlanma": {
      "background": "#faf5ff",
      "border": "#7c3aed",
      "highlight": {
        "background": "#f3e8ff",
        "border": "#6d28d9"
      },
      "color": "#3b0764",
      "badgeClass": "bg-purple-100 text-purple-900 border-purple-300"
    },
    "19yy": {
      "background": "#fff1f2",
      "border": "#e11d48",
      "highlight": {
        "background": "#ffe4e6",
        "border": "#be123c"
      },
      "color": "#881337",
      "badgeClass": "bg-rose-100 text-rose-900 border-rose-300"
    },
    "20yy": {
      "background": "#fff7ed",
      "border": "#ea580c",
      "highlight": {
        "background": "#ffedd5",
        "border": "#c2410c"
      },
      "color": "#7c2d12",
      "badgeClass": "bg-orange-100 text-orange-900 border-orange-300"
    }
  }
});

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

function getEraTheme(era) {
  const mode = isDarkMode() ? 'dark' : 'light';
  const palette = RAW_ERA_THEMES[mode] || RAW_ERA_THEMES.dark;
  return palette[era] || palette.antik;
}
