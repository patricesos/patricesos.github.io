---
draft: true
title: "Générateurs Python : la paresse qui rend productif"
date: 2026-03-15
description: "Comprendre les générateurs en Python, du yield de base aux generator expressions, avec des benchmarks concrets."
thumbnail: "/images/brainyard/generateurs.jpg"
tags: ["python", "programmation"]
categories: ["dev", "tutorial"]
---

## Le problème

Tu as déjà chargé un fichier de 10 Go en mémoire parce que `readlines()` avait l'air inoffensif ? Moi oui. Et ça pique.

```python
# ❌ Mauvais : tout en RAM
with open("énorme_fichier.log") as f:
    lignes = f.readlines()
    for ligne in lignes:
        process(ligne)
```

`readlines()` matérialise une liste de **toutes** les lignes. Si le fichier fait 10 Go, ta RAM prend 10 Go. Pas ouf.

## La solution : l'itérateur paresseux

Un générateur est une fonction qui utilise `yield` au lieu de `return`. Au lieu de construire toute la séquence d'un coup, il produit les valeurs une par une, à la demande.

```python
def lire_fichier(chemin):
    with open(chemin) as f:
        for ligne in f:          # ligne est déjà paresseux !
            yield ligne.strip()
```

Utilisation :

```python
for ligne in lire_fichier("énorme_fichier.log"):
    process(ligne)               # une ligne à la fois en mémoire
```

## Generator expressions

Comme les list comprehension, mais avec des parenthèses — et sans matérialiser la liste :

```python
carrés = (x * x for x in range(10_000_000))  # ⚡ instantané
liste_carrés = [x * x for x in range(10_000_000)]  # 💥 300 Mo en RAM
```

## Pipeline paresseux

Les générateurs se chaînent magnifiquement :

```python
def pairs(iterable):
    for x in iterable:
        if x % 2 == 0:
            yield x

def doubler(iterable):
    for x in iterable:
        yield x * 2

# Aucune valeur calculée tant qu'on n'itère pas
pipeline = doubler(pairs(range(100_000)))

# Là seulement ça tourne
for val in pipeline:
    if val > 100:
        break
```

Chaque appel à `next()` traverse la chaîne : `range` → `pairs` → `doubler` → ta boucle. Zéro liste intermédiaire.

## Benchmark vite fait

```python
from time import perf_counter

N = 10_000_000

t0 = perf_counter()
total = sum(x * x for x in range(N))    # générateur
t1 = perf_counter()
print(f"Generator : {t1 - t0:.2f}s")

t0 = perf_counter()
total = sum([x * x for x in range(N)])  # liste
t1 = perf_counter()
print(f"Liste     : {t1 - t0:.2f}s")
```

Sur ma machine :

```
Generator : 1.23s
Liste     : 2.01s
```

Le générateur est plus rapide **et** utilise ~0 mémoire de plus. La liste, elle, a pompé 300 Mo pendant l'exécution.

## `yield from` — déléguer à un sous-générateur

```python
def flatten(iterable):
    for item in iterable:
        if hasattr(item, "__iter__") and not isinstance(item, str):
            yield from flatten(item)   # recursive delegation
        else:
            yield item

list(flatten([1, [2, [3, 4]], 5]))
# → [1, 2, 3, 4, 5]
```

`yield from` est du sucre syntaxique pour `for x in sub: yield x`, en mieux (il propage les retours, les exceptions, etc.).

## Ce qu'il faut retenir

1. `yield` → fonction devient générateur
2. Les générateurs sont **paresseux** : calcul à l'itération
3. `()` au lieu de `[]` → generator expression
4. Le chaînage de générateurs crée des pipelines sans overhead mémoire
5. `yield from` délègue proprement à un sous-itérateur

Les générateurs ne sont pas réservés aux gros fichiers. Dès que ta séquence peut être produite à la volée, `yield` est presque toujours la meilleure option.
