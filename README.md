# 🌸 Flower-Shop

[![Angular](https://img.shields.io/badge/Angular-13-red?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)

---

## 🚀 Présentation du projet

**Flower-Shop** est une application e-commerce complète dédiée à la vente de fleurs et produits associés.  
Elle inclut un **tableau de bord administrateur** pour gérer les produits, catégories, utilisateurs et commandes.

---

## 🧩 Fonctionnalités principales

### Côté Administrateur

- Tableau de bord avec statistiques :
  - Total produits
  - Total utilisateurs
  - Total catégories
  - Total commandes et montant global
- Gestion des produits :
  - Ajouter, modifier et supprimer un produit
  - Prévisualisation d'image avant ajout
  - Pagination et filtrage
- Gestion des commandes :
  - Modifier le statut des commandes (pending, paid, shipped, delivered, cancelled)
  - Affichage responsive (desktop et mobile)

### Côté Client

- Navigation fluide sur les catégories et produits
- Détails de produit avec images et prix
- Commande en ligne (intégration possible avec API backend)

---

## ⚙️ Technologies utilisées

- **Frontend :**
  - Angular 13 (Standalone Components)
  - Bootstrap 5
  - HTML5 & CSS3
  - NgRx pour la gestion d'état
  - RxJS pour la gestion des flux asynchrones
  - ngx-toastr pour notifications

- **Backend :**
  - PHP pour l'API REST
  - MySQL pour la base de données

- **Outils supplémentaires :**
  - Angular Material (dialog confirm)
  - FormData pour la gestion des fichiers images

---

## 🛠️ Installation

```bash
# Cloner le projet
git clone https://github.com/oumobayid/flower-shop.git

# Aller dans le dossier frontend
cd flower-shop

# Installer les dépendances
npm install

# Lancer le projet Angular
ng serve

---

