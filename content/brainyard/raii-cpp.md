---
title: "RAII en C++ : ne jamais oublier de libérer la mémoire"
date: 2026-06-15
description: "Le RAII est ce qui rend le C++ à la fois sûr et performant. Une démo avec smart pointers, scope guards et containers."
tags: ["c++", "programmation"]
categories: ["dev", "tutorial"]
---

## Le problème du C

En C, chaque `malloc` attend son `free`. Oublie-le, et ta mémoire fuit. Retourne avant le `free`, et elle fuit aussi. Lève une exception… ah non, le C n'a pas d'exceptions.

```c
void traiter_fichier(const char *chemin) {
    FILE *f = fopen(chemin, "r");
    if (!f) return;

    char *buffer = malloc(1024);
    if (!buffer) {
        fclose(f);          // ← déjà un cas d'erreur à gérer
        return;
    }

    if (lire_entete(f, buffer) < 0) {
        free(buffer);       // ← facile à oublier
        fclose(f);
        return;
    }

    // ...

    free(buffer);
    fclose(f);
}
```

5 lignes utiles, ~15 lignes de cleanup. Le moindre retour anticipé oublié = fuite.

## RAII : Resource Acquisition Is Initialization

L'idée est simple : **le constructeur acquiert la ressource, le destructeur la libère**. Comme le destructeur est appelé **automatiquement** quand l'objet sort du scope, la ressource est libérée quoi qu'il arrive.

```cpp
class Buffer {
    int *data;
public:
    explicit Buffer(size_t n) : data(new int[n]) {}
    ~Buffer() { delete[] data; }    // ← automatique !
    // ... copie, mouvement, etc.
};
```

Plus besoin de `free` manuel :

```cpp
void traiter() {
    Buffer b(1024);       // allocation
    if (erreur) return;   // Buffer::~Buffer() appelé automatiquement !
    // ...
}                         // idem ici
```

## `std::unique_ptr` — le pointeur qui se nettoie tout seul

La STL fournit des smart pointers prêts à l'emploi. `unique_ptr` est un pointeur **exclusif** : un seul propriétaire à la fois.

```cpp
#include <memory>

void demo() {
    auto p = std::make_unique<int>(42);
    std::cout << *p << '\n';   // 42
    // Pas de delete — fait automatiquement à la sortie
}
```

Pour les tableaux :

```cpp
auto tab = std::make_unique<int[]>(100);
tab[0] = 10;
// delete[] automatique
```

## `std::shared_ptr` — le compteur de références

Quand plusieurs objets partagent une ressource :

```cpp
auto a = std::make_shared<int>(42);
{
    auto b = a;    // compteur = 2
    // ...
}                  // compteur = 1 (b détruit)
// compteur = 0 → ressource libérée
```

Pas de `free`, pas de `delete`, pas de doute.

## Exemple concret : fichier automatique

```cpp
#include <fstream>
#include <string>
#include <stdexcept>

void ecrire_fichier(const std::string &chemin) {
    std::ofstream f(chemin);       // fopen
    if (!f) throw std::runtime_error("oups");

    f << "Hello, Brainyard !\n";

    // fclose automatique à la sortie du scope
    // même en cas d'exception !
}
```

`std::ofstream` encapsule un `FILE*`. Son destructeur ferme le fichier. Toujours.

## Scope guard maison

Parfois tu as besoin de libérer une ressource qui n'a pas de wrapper RAII. Un scope guard fait l'affaire :

```cpp
template <typename F>
struct ScopeGuard {
    F f;
    explicit ScopeGuard(F f_) : f(f_) {}
    ~ScopeGuard() { f(); }
};

template <typename F>
ScopeGuard<F> make_guard(F f) { return ScopeGuard<F>(f); }
```

Usage :

```cpp
void avec_ressource_brute() {
    Ressource r = acquerir();
    auto _ = make_guard([&] { liberer(r); });

    if (condition) return;  // ← liberer(r) automatique
    // ...
}
```

Depuis C++23, la STL a `std::scope_exit` qui fait ça nativement.

## Containers RAII

Tous les containers STL sont RAII :

```cpp
{
    std::vector<int> v(1'000'000);  // allocation heap
    // ...
}  // destructeur → libération automatique

{
    std::map<std::string, std::vector<int>> m;
    m["clé"] = {1, 2, 3};
}  // tout est nettoyé
```

Zéro `free`, zéro `delete`. Impossible d'oublier.

## Ce qu'il faut retenir

1. **RAII** = constructeur acquiert, destructeur libère. Automatique.
2. `std::unique_ptr` → propriété exclusive, pas d'overhead
3. `std::shared_ptr` → comptage de références, utile pour le partage
4. Les containers STL sont RAII — utilise-les
5. Les scope guards comblent les trous pour les ressources non-RAII
6. En C++ moderne, un `delete` explicite est un smell

Le RAII est ce qui rend le C++ unique : la performance du C avec une gestion mémoire **impossible à oublier**. Et ça, c'est énorme.
