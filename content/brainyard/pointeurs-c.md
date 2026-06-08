---
title: "Les pointeurs en C : petits textes et gros dégâts"
date: 2026-05-10
description: "Une démo concrète des pointeurs en C, avec heap, stack, segmentation fault, et quelques leçons apprises à la dure."
tags: ["c", "programmation"]
categories: ["dev", "tutorial"]
---

## Le mythe

« Les pointeurs, c'est compliqué. »

Non. Les pointeurs sont simples : une **variable qui contient une adresse mémoire**. Ce qui est compliqué, c'est ce qui se passe **autour** — la gestion manuelle de la mémoire, les fuites, les pointeurs pendouillants.

## C'est quoi, un pointeur ?

```c
int x = 42;
int *p = &x;   // p contient l'adresse de x

printf("%d\n", *p);  // 42 — déréférencement
```

- `&x` → adresse de `x`
- `*p` → valeur à l'adresse `p`
- `int *p` → p est un pointeur vers un `int`

Visualisons :

```
Variable x dans la stack :
   Adresse    Valeur
   0x7fff..   42
                ^
   p = &x ──────┘
```

## Passage par référence

En C, tout est passé par valeur. Les pointeurs permettent de simuler un passage par référence :

```c
void echanger(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x = 10, y = 20;
    echanger(&x, &y);
    printf("%d %d\n", x, y);  // 20 10
    return 0;
}
```

Sans pointeur, `echanger` ne ferait rien — il modifierait des copies.

## Allocation dynamique (le fameux `malloc`)

La stack a une taille limitée. Pour des données dont la taille n'est pas connue à la compilation, on utilise le **heap** :

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Allouer un tableau de 5 entiers sur le heap
    int *tab = malloc(5 * sizeof(int));
    if (!tab) {
        fprintf(stderr, "malloc a échoué\n");
        return 1;
    }

    for (int i = 0; i < 5; i++)
        tab[i] = i * i;

    free(tab);      // ← NE SURTOUT PAS OUBLIER
    return 0;
}
```

**Règle d'or** : tout `malloc` doit avoir son `free`. Sinon → **fuite mémoire**.

## Le piège : pointeur vers une variable locale

```c
int *toto() {
    int x = 42;
    return &x;     // ❌ x est détruit à la sortie de toto() !
}

int main() {
    int *p = toto();
    printf("%d\n", *p);  // undefined behavior — segmentation fault probable
    return 0;
}
```

`x` vit sur la stack. Dès que `toto()` retourne, sa stack frame est récupérée. Le pointeur pointe vers de la mémoire déjà réutilisée — **dangling pointer**.

## Arithmétique des pointeurs

```c
int arr[] = {10, 20, 30, 40, 50};
int *p = arr;

printf("%d\n", *p);       // 10
p++;                       // avance de sizeof(int) octets
printf("%d\n", *p);       // 20
printf("%d\n", *(p + 2)); // 40

// Parcourir avec un pointeur
for (int *q = arr; q < arr + 5; q++)
    printf("%d ", *q);     // 10 20 30 40 50
```

`p + n` avance de `n * sizeof(type)` octets. Le compilateur gère la multiplication tout seul.

## Tableau vs pointeur — le piège `sizeof`

```c
int arr[5] = {1, 2, 3, 4, 5};
int *p = arr;

printf("%zu\n", sizeof(arr));  // 20 (5 × 4)
printf("%zu\n", sizeof(p));    // 8 (taille d'un pointeur sur système 64-bit)
```

`arr` n'est pas un pointeur — c'est un tableau. `sizeof` sur un tableau donne la taille totale. Dès que tu passes `arr` à une fonction, il **decaye** en pointeur et tu perds l'info.

## Une fonction qui prend un tableau… ou pas

```c
// Version 1 : syntaxe tableau
void afficher_1(int arr[], size_t n) {
    for (size_t i = 0; i < n; i++)
        printf("%d ", arr[i]);
}

// Version 2 : syntaxe pointeur (strictement équivalente)
void afficher_2(int *arr, size_t n) {
    for (size_t i = 0; i < n; i++)
        printf("%d ", *(arr + i));
}
```

Ces deux fonctions sont **identiques** pour le compilateur. La première n'est que du sucre syntaxique. D'où la convention : toujours passer la taille à côté du tableau.

## Piège final : le buffer overflow

```c
int main() {
    char buffer[8];
    strcpy(buffer, "cette phrase est trop longue");  // 💥
    return 0;
}
```

`strcpy` ne vérifie pas les limites. Il écrit au-delà de `buffer`, écrase la stack, et potentiellement fait planter le programme… ou pire. Toujours utiliser `strncpy` ou `snprintf` :

```c
char buffer[8];
snprintf(buffer, sizeof(buffer), "%s", "cette phrase est trop longue");
// buffer = "cette p" — tronqué proprement
```

## Ce qu'il faut retenir

1. Un pointeur = une adresse, `*` pour déréférencer, `&` pour prendre l'adresse
2. `malloc` → `free`, toujours
3. Jamais de `return &variable_locale`
4. Un tableau n'est pas un pointeur, mais il decaye en pointeur
5. `snprintf` est ton ami contre les buffer overflows

Le C ne te protège pas. C'est sa force et sa faiblesse. Avec les pointeurs, tu as un couteau suisse — utile, mais tu peux te couper.
