"""Every translation file has the English keys."""

import json
from pathlib import Path

TRANSLATIONS = Path(__file__).parent.parent / "custom_components" / "home_camera" / "translations"
LANGS = {
    "en",
    "fr",
    "de",
    "es",
    "sr",
    "sr-Latn",
    "it",
    "nl",
    "pt",
    "pl",
    "ro",
    "da",
    "sv",
    "bg",
    "ru",
    "uk",
    "hu",
    "sk",
    "cs",
    "sl",
    "lv",
    "el",
}


def _paths(d, prefix=""):
    for k, v in d.items():
        yield from _paths(v, f"{prefix}{k}.") if isinstance(v, dict) else [f"{prefix}{k}"]


def test_same_keys_in_every_language():
    files = {p.stem: json.loads(p.read_text(encoding="utf-8")) for p in TRANSLATIONS.glob("*.json")}
    assert set(files) == LANGS
    ref = sorted(_paths(files["en"]))
    for lang, data in files.items():
        assert sorted(_paths(data)) == ref, lang
