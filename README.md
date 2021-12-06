# Agence-SNCF
Une application web (Express, node.js) pour gérer une base de donnée MySQL. Elle simule une plateforme de réservation de billets de train.

# Description

Le dossier contient les fichiers de l'application web et un script .sql qu'il va falloir executer pour générer la base de donnée sur votre ordinateur. `node.js` est nécéssaire pour lancer le serveur.

# Installation

- Cloner le dossier sur votre appareil.
- Executer le script `bdd.sql` pour créer votre base de donnée, la base de donnée doit s'appeler `SNCF_app`. Sur mysql-workbench : Files -> Open SQL Script
- Executer ces commandes dans un terminal mysql.

```
CREATE USER 'node'@'localhost' 
IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILIGES ON SNCF_app.* TO 'node'@'localhost';
```
Cela permet de créer un l'utilisateur ayant avec un certain type d'authentification que node.js comprend et de lui donner les privilèges permettant de modifier.
- Installer node.js sur votre ordinateur. Le lien d'installation se trouve sur https://nodejs.org/en/download/. 
- Dans le fichier racine (où se trouve package.json) executer cette commande : `npm install`. Cela permet d'installer tous les packages et dépendances utilisés.
- Executer `npm run serve` ou `node main.js`
- Dans un navigateur se rendre à l'adresse `localhost:8080/`