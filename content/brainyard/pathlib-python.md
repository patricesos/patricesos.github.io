---
draft: true
title: "Pathlib : adieu les chaînes de caractères bancales"
date: 2026-04-20
description: "Manipuler les chemins fichiers avec pathlib, l'API propre et cross-platform que Python mérite."
thumbnail: "/images/brainyard/pathlib.jpg"
tags: ["python", "programmation"]
categories: ["dev", "tutorial"]
---

## Pourquoi pathlib ?

Avant Python 3.4, manipuler des chemins ressemblait à ça :

```python
import os

chemin = os.path.join("dossier", "sous-dossier", "fichier.txt")
if os.path.exists(chemin):
    ext = os.path.splitext(chemin)[1]
    parent = os.path.dirname(chemin)
```

Ça marche, mais c'est verbeux, fragmenté (les fonctions sont éparpillées dans `os`, `os.path`, `shutil`…) et platform-dependent — sur Windows, `os.path.join` utilise `\\`, pas `/`.

`pathlib` unifie tout ça avec une **API orientée objet**.

## Le coeur : `Path`

```python
from pathlib import Path

p = Path("dossier/sous-dossier/fichier.txt")
```

`Path` est intelligent : sur Windows il utilisera `\`, sur Linux `/`. Pas besoin d'y penser.

### Opérations de base

```python
p = Path("data/images/photo.jpg")

p.name          # 'photo.jpg'
p.stem          # 'photo'
p.suffix        # '.jpg'
p.parent        # Path('data/images')
p.parents       # [Path('data/images'), Path('data'), Path('.')]

p.exists()      # True / False
p.is_file()     # True / False
p.is_dir()      # True / False
p.stat().st_size  # taille en octets
```

### Construction de chemins

```python
data = Path("data")
chemin = data / "images" / "photo.jpg"   # ⚡ surcharge de /

# Équivalent à :
chemin = Path("data").joinpath("images", "photo.jpg")
```

L'opérateur `/` rend le code **beaucoup** plus lisible que `os.path.join(...)`.

## Lire et écrire sans `open()`

```python
p = Path("note.txt")

# Lire
contenu = p.read_text(encoding="utf-8")
lignes = p.read_text().splitlines()
bytes = p.read_bytes()

# Écrire
p.write_text("Hello, Brainyard !", encoding="utf-8")
p.write_bytes(b"\x00\x01\x02")
```

Pratique pour les petits fichiers. Pour les gros, on utilise toujours `p.open()`.

## Parcourir des dossiers

```python
dossier = Path(".")

# Tous les fichiers .py
for f in dossier.glob("**/*.py"):
    print(f)

# Via une comprehension
sizes = {f: f.stat().st_size for f in dossier.rglob("*.py")}
```

`glob` et `rglob` remplacent `os.walk()` avec une API bien plus agréable.

## Exemple concret : renommer des fichiers

```python
from pathlib import Path

dossier = Path("photos")
for f in dossier.glob("*.jpg"):
    nouveau = f.with_stem(f.stem.lower().replace(" ", "_"))
    f.rename(nouveau)
```

Cinq lignes, zéro piège. `with_stem` change le nom sans toucher à l'extension.

## Démo : explorateur de projet

```python
from pathlib import Path
from collections import Counter

def analyser_projet(racine):
    """Compte les extensions dans un projet."""
    racine = Path(racine)
    if not racine.exists():
        return

    extensions = Counter()
    total = 0

    for f in racine.rglob("*"):
        if f.is_file():
            extensions[f.suffix.lower() or "(no ext)"] += 1
            total += 1

    print(f"{'Extension':<12} {'Nb':<6} {'%'}")
    print("-" * 28)
    for ext, count in extensions.most_common():
        print(f"{ext:<12} {count:<6} {count/total*100:.1f}%")

analyser_projet(".")
```

```
Extension     Nb     %
----------------------------
.py           34     42.5%
.md           18     22.5%
.jpg          12     15.0%
.css          8      10.0%
.html         6      7.5%
.toml         2      2.5%
```

## Ce qu'il faut retenir

1. `Path` remplace `os.path.*` — une classe, pas 15 fonctions
2. `/` construit des chemins — lisible et cross-platform
3. `read_text` / `write_text` pour les fichiers simples
4. `glob` / `rglob` pour parcourir — plus propre que `os.walk`
5. `with_stem`, `with_suffix`, `with_name` — transformation sans casse

Si tu codes en Python et que tu utilises encore `os.path`, essaie `pathlib` pour un après-midi. Tu ne reviendras pas en arrière.
