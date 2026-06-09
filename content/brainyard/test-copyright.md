---
title: "Test copyright lightbox"
description: "Article de test pour vérifier la chaîne de fallback copyright"
date: 2026-06-10
draft: true
tags: ["test"]
categories: ["meta"]
---

## Test 1 : copyright explicite

Devrait afficher **"© Mon copyright perso"** :

{{< img-abs src="/images/brainyard/bienvenue.jpg" name="Avec copyright perso" copyright="© Mon copyright perso" >}}

## Test 2 : copyright omis (page)

Devrait afficher **le copyright de l'article** (via `$.Page.Params.copyright`) :

{{< img-abs src="/images/brainyard/pathlib.jpg" name="Fallback page" >}}

## Test 3 : copyright omis (site)

Devrait afficher **"Patrice Gnimdou SOSSOU"** (via `site.Params.site.copyright`) :

{{< img-abs src="/images/brainyard/raii.jpg" name="Fallback site" >}}
