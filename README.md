<div align="center">

# ⚽ S7 LÉGENDES — Vintage Football Jersey Store

**Plateforme e-commerce haut de gamme dédiée aux maillots de football rétro & archives cultes.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 À Propos (About)

**S7 LÉGENDES** est une boutique en ligne moderne et immersive inspirée par la culture vintage du football. Chaque maillot raconte une histoire : des éditions d'anthologie de Coupe du Monde aux soirées légendaires de Ligue des Champions des années 90 et 2000.

Le projet allie une **direction artistique rétro premium** (typographies d'archives, palette sable et bordeaux vintage, micro-interactions soignées) à une **architecture technique ultra-performante** basée sur Next.js 16 et Supabase.

---

## ✨ Fonctionnalités Clés (Key Features)

### 🛍️ Expérience Boutique & Client
- **Navigation & Filtrage Dynamique** : Recherche instantanée avec debouncing, filtrage par catégorie et par taille en temps réel sans rechargement de page.
- **Commande Directe par WhatsApp** : Intégration fluide générant des messages de commande pré-remplis (nom du maillot, joueur, saison, taille sélectionnée, quantité et lien du produit).
- **Fiche Produit Détaillée** : Galerie d'images haute résolution, sélecteur de taille interactif (avec gestion des ruptures de stock), compteur de quantité et accordéons d'informations.
- **Design 100% Responsive & Fluide** : Système de padding adaptatif optimisé pour mobile, tablette et écrans larges 4K.
- **Page 404 Thématique** : Page d'erreur personnalisée "Page Hors-Jeu" avec suggestions de catégories et assistance directe.

### 🛡️ Espace d'Administration Sécurisé
- **Portail Admin Protégé** : Système d'authentification robuste avec redirection automatique vers le panneau de gestion.
- **Gestion des Produits (CRUD)** : Ajout, modification, suppression de maillots, gestion des photos (upload & URLs), statuts actif/inactif et mise en vedette.
- **Gestion des Tailles & Stocks** : Contrôle du stock variant par variant (XS à XXL).
- **Gestion des Catégories** : Organisation des collections (Coupe du Monde, UCL, Rétro Club, etc.).
- **Métriques en Temps Réel** : Tableau de bord affichant le total de maillots, les pièces en vedette et les alertes de stock faible.

---

## 🛠️ Stack Technique (Tech Stack)

| Couche | Technologie |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Server Components & Server Actions) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Language** | TypeScript |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Auth Session) |
| **State & Cache** | TanStack React Query v5 |
| **Icons & Animations** | Lucide React, Motion (Framer Motion) |
| **Form Handling** | React Hook Form & Zod Validation |

---

## 📁 Structure du Projet (Folder Structure)

```
s7-football/
├── app/
│   ├── (store)/               # Storefront routes (Client Facing)
│   │   ├── about/             # Page À Propos
│   │   ├── category/[slug]/   # Vue par Catégorie
│   │   ├── product/[slug]/    # Fiche Produit
│   │   ├── shop/              # Catalogue complet
│   │   ├── not-found.tsx      # 404 Storefront
│   │   └── page.tsx           # Page d'accueil (Hero, Catégories, Légendes)
│   ├── admin/                 # Administration Portal
│   │   ├── categories/        # Gestion des catégories
│   │   ├── login/             # Page de connexion Admin
│   │   ├── products/          # Tables et formulaires produits
│   │   ├── layout.tsx         # Layout avec sidebar & protection
│   │   └── page.tsx           # Dashboard vue d'ensemble
│   ├── globals.css            # Styles globaux & animations de chargement
│   └── not-found.tsx          # 404 racine
├── components/
│   ├── admin/                 # Composants d'administration
│   ├── home/                  # Sections d'accueil (Hero, Carrousel, Social)
│   ├── layout/                # Header & Footer
│   ├── product/               # ProductCard, Gallery, SizeSelector, Skeletons
│   └── shop/                  # Vue catalogue et filtres
├── i18n/                      # Système de localisation (FR)
├── lib/
│   ├── actions/               # Server Actions (Auth, Products, Categories)
│   ├── queries/               # Requêtes Supabase (Storefront & Admin)
│   ├── supabase/              # Clients Supabase (Client, Server & Middleware)
│   └── whatsapp.ts            # Générateur de liens de commande WhatsApp
├── public/                    # Assets visuels, logos, mockups
├── middleware.ts              # Protection des routes /admin
└── README.md                  # Documentation du projet
```

---

## 🚀 Démarrage Rapide (Getting Started)

### Prérequis
- [Node.js](https://nodejs.org/) (version 20 ou supérieure recommandée)
- [Git](https://git-scm.com/)
- Un projet [Supabase](https://supabase.com/) configuré

### 1. Cloner le dépôt
```bash
git clone https://github.com/dola5xd/S7-legends.git
cd S7-legends
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_WHATSAPP_NUMBER=33658898860
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Base de Données (Database Setup)

Le projet utilise les tables suivantes sur PostgreSQL via Supabase :
- `categories` : `id`, `name`, `slug`, `description`, `active`, `created_at`
- `products` : `id`, `name`, `slug`, `player`, `year`, `team`, `product_type`, `price`, `images`, `category_id`, `active`, `featured`, `condition`, `shipping_text`
- `product_variants` : `id`, `product_id`, `size` (XS, S, M, L, XL, XXL), `stock`, `available`

---

## 📦 Déploiement (Deployment)

Le projet est optimisé pour être déployé en un clic sur [Vercel](https://vercel.com/) :

1. Poussez votre code sur GitHub.
2. Importez le projet sur Vercel.
3. Renseignez les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).
4. Déployez !

---

## 📄 Licence

Projet développé avec passion pour **S7 LÉGENDES**. Tous droits réservés.
