---
title: "Recréer un sac Louis Vuitton dans CLO3D"
date: 2021-12-15
description: "En décembre 2021, j'ai décidé de reproduire un sac Louis Vuitton dans CLO3D. Voici le processus — modélisation, UV, textures, simulations — et ce que j'en ai appris."
thumbnail: "/images/brainyard/louis-v-bag.png"
tags: ["clo3d", "3d", "fashion", "texturing"]
categories: ["3d"]
draft: true
---

C'était en décembre 2021. Je commençais à m'intéresser sérieusement à la mode digitalisée — le *fashion tech*, comme on dit. J'avais découvert CLO3D quelques mois plus tôt, et après des tutoriels basiques (un t-shirt, une robe, un blouson), j'avais envie de quelque chose de plus corsé.

Un sac Louis Vuitton.

Pourquoi un sac ? Parce que c'est un objet complexe : des volumes rigides ET souples, du cuir qui se plie, des coutures apparentes, un monogramme qui doit suivre les courbes, une anse, des fermetures. Bref, un bon test pour savoir si je maîtrisais vraiment le logiciel.

J'ai passé environ deux semaines là-dessus, le soir après le boulot.

## Les références

Avant d'ouvrir CLO3D, il fallait un plan. J'ai passé une soirée à constituer un moodboard :

- Photos du sac sous tous les angles (Pinterest, sites de revente, lookbooks officiels)
- Croquis cotés avec les dimensions approximatives (longueur, hauteur, profondeur, anse)
- Détails des coutures, des pinces, des soufflets
- Le monogramme LV — texture du canvas, répétition, orientation

## Le patron dans CLO3D

CLO3D travaille avec des patrons 2D qu'on assemble en 3D, comme dans la vraie couture. J'ai commencé par esquisser les pièces :

- **Le corps principal** : un grand rectangle avec des pinces pour créer le volume
- **Les soufflets latéraux** : pour donner la profondeur
- **Le rabat** : avec sa courbure caractéristique
- **L'anse** : une bande étroite qui sera simulée en cuir souple
- **Les bretelles** : amovibles dans le vrai, simulées comme des tubes dans CLO3D

Chaque pièce a ses propriétés : type de tissu, épaisseur, rigidité. Pour un sac, c'est crucial — les soufflets doivent être moins rigides que le corps pour permettre l'ouverture, mais assez pour garder la structure.

```yaml
# CLO3D property preset pour le corps du sac
property:
  type: cuir
  thickness: 1.2mm
  stiffness: 0.8
  density: 0.6
  stretch: faible
```

## Les UVs — là où ça se corse

Ah, les UVs. Le monogramme Louis Vuitton doit tomber **droit** sur le sac. Pas déformé, pas décalé, pas coupé au milieu d'un motif. Dans la vraie vie, le canvas est imprimé avant assemblage — les coutures coupent à travers le motif, et c'est assumé.

En 3D, j'ai dû choisir : est-ce que je laisse les coutures couper le monogramme (réaliste) ou j'ajuste les UVs pour que le motif soit continu (propre) ?

J'ai fait les deux.

La première version suivait des UVs floutés — le monogramme passait par-dessus les coutures, donnant un résultat lisse mais irréaliste. Belle image, mauvais sac.

J'ai tout refait. Pièce par pièce, projection par projection. Le résultat était moins parfait visuellement, mais *juste* — les motifs s'arrêtaient là où la vraie couture coupe le canvas.

## Les textures

Le cuir du LV — *Vernis* ou *Monogram* canvas — a un rendu difficile à attraper. Ce n'est pas du plastique, ce n'est pas du cuir pleine fleur. C'est un revêtement enduit avec un grain très fin, un léger brillant, et une couleur chaude.

J'ai utilisé Substance Painter pour créer les textures :

- Base de cuir avec un grain très subtil (bump map à 0.3)
- Chanfrein sur les bords des pièces (pour la lumière)
- Une couche de *clear coat* léger pour le brillant caractéristique du canvas
- Les coutures : un stitch generator avec un fil légèrement plus foncé

Le monogramme a été fait en masque alpha — un pattern répété que j'ai plaqué sur chaque pièce dans Substance.

## Les rendus before/after

J'ai fait plusieurs passes de rendu. La première série — bleue — était expérimentale. Les proportions étaient bonnes mais la matière ne rendait pas. Trop plastique. Les plis étaient mous, le sac ne tenait pas debout.

Je suis retourné dans CLO3D. J'ai augmenté la *stiffness* du corps, ajouté des *studds* invisibles pour rigidifier les bords. J'ai aussi retravaillé la simulation de gravité — un vrai sac posé à plat s'affaisse un peu, mais garde sa structure. Le mien s'écrasait comme une chaussette.

La série orange est arrivée après ces ajustements. Les plis tombaient mieux, les lumières révélaient la texture du cuir, le monogramme s'alignait presque parfaitement.

{{< gallery >}}
{{< img-abs src="/projets/louis-v-bag/blue1-before.png" layout="half" name="Version bleue — premier essai, matière encore plastique" >}}
{{< img-abs src="/projets/louis-v-bag/orange1-after.png" layout="half" name="Version orange — simulation et textures retravaillées" >}}
{{< /gallery >}}
     

Deux autres paires de rendus montrent l'évolution sous différents angles :

{{< gallery >}}
{{< img-abs src="/projets/louis-v-bag/blue2-before.png" layout="half" name="Série bleue — le pli du rabat manque encore de tension" >}}
{{< img-abs src="/projets/louis-v-bag/orange2-after.png" layout="half" name="Série orange — la structure tient, les reflets suivent" >}}
{{< /gallery >}}

La galerie complète est sur la [page projet](/projets/louis-v-bag/).

## Ce que j'ai retenu

Ce projet m'a appris plusieurs choses :

1. **CLO3D n'est pas un jouet.** C'est un outil technique qui demande de comprendre la couture, les matériaux, et la physique des tissus. Tu ne pondras pas un sac parfait en claquant des doigts.
2. **Les UVs décident de tout.** Un mauvais UV mapping tue le réalisme, même avec la meilleure texture du monde.
3. **Le diable est dans la rigidité.** La différence entre un rendu convaincant et un rendu *meh*, c'est souvent les paramètres de simulation — stiffness, damping, friction.
4. **La mode digitalisée, c'est l'avenir.** En 2021, CLO3D était déjà utilisé par des marques comme Adidas, H&M, Hugo Boss. Le *digital fashion* n'est pas un effet de mode — c'est une industrie en pleine explosion.

Et puis, sincèrement, c'était juste satisfaisant de voir un objet qu'on connaît bien — un sac qu'on a vu cent fois dans la rue — apparaître sous ses doigts, pièce par pièce, dans un logiciel.

## Envie d'essayer ?

Si tu veux te lancer dans CLO3D, quelques ressources que j'aurais aimé avoir au début :

- CLO3D a une [chaine YouTube](https://youtube.com/@clo3d_official) avec des tutos officiels solides
- Le site [Fashion Roadman](https://fashionroadman.com) a des articles techniques bien plus poussés que ce que je raconte ici
- Le forum CLO3D est actif et les gens y sont étonnamment gentils

Le projet lui-même est visible dans la section [Projets](/projets/) avec les rendus finaux. Si t'as des questions ou des idées d'amélioration, [contacte-moi](/a-propos/) — je suis curieux de savoir ce que tu ferais différemment.
