# Agence-SNCF
Une application web (Express, node.js) pour gérer une base de donnée MySQL. Elle simule une plateforme de réservation de billets de train.

# Description

Le dossier contient les fichiers de l'application web et un script .sql qu'il va falloir executer pour générer la base de donnée sur votre ordinateur. `node.js` est nécéssaire pour lancer le serveur.

# Installation

- Cloner le dossier sur votre appareil.
- Executer le script `bdd.sql` pour créer votre base de donnée. Sur mysql-workbench : Files -> Open SQL Script
- Executer cette commande dans un terminal mysql

```
CREATE USER 'node'@'localhost' 
IDENTIFIED WITH mysql_native_password BY 'password';
```
Cela permet de créer un l'utilisateur ayant avec un certain type d'authentification que node.js comprend.
- Installer node.js sur Ubuntu il faut executer ces commande :
```
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs 
```
- Dans le fichier racine executer cette commande : `npm install`. Cela permet d'installer tous les packages utilisés.
- Executer `npm run serve`
- Dans un navigateur se rendre à l'adresse `localhost:8080/`