# 📱 Guide : Comment générer le fichier APK Android (masseko.apk) dans VS Code pour MASSEKO

Ce guide pas-à-pas vous explique comment compiler votre application **MASSEKO** en fichier **APK installable nommé `masseko.apk`** avec **son propre logo/icône officiel** sur n'importe quel smartphone Android depuis votre terminal **VS Code**.

---

## 🛠️ Prérequis sur votre ordinateur

1. **Node.js** (version 18 ou supérieure)
2. **VS Code** (Visual Studio Code)
3. **Java JDK** (OpenJDK 17 ou 21 recommandé) : vérifiez avec `java -version`
4. **Android SDK / Android Studio** (nécessaire pour les outils de compilation Android `gradle` & `sdkmanager`)

---

## 🚀 Étapes Pas-à-Pas dans VS Code

### Étape 1 : Ouvrir le projet dans VS Code
Ouvrez le dossier du projet dans Visual Studio Code et ouvrez un terminal intégré (`Ctrl + \`` ou `Terminal > New Terminal`).

### Étape 2 : Installer les dépendances (si ce n'est pas déjà fait)
Dans le terminal VS Code, exécutez :
```bash
npm install
```

### Étape 3 : Générer les icônes & synchroniser
Exécutez :
```bash
npm run cap:sync
```
*Cette commande génère automatiquement toutes les icônes Masseko (adaptatives, legacy et splash), compile le code web et synchronise avec Android.*

---

## 📦 Option A : Générer l'APK directement depuis le terminal VS Code (Recommandé)

Dans le terminal de VS Code, tapez simplement :

### 👉 Pour générer `masseko.apk` :
```bash
npm run build:apk
```

*Ou manuellement :*
- **Sur Linux / macOS :**
  ```bash
  npm run build
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```
- **Sur Windows (PowerShell / CMD) :**
  ```bash
  npm run build
  npx cap sync android
  cd android ; .\gradlew.bat assembleDebug
  ```

### 📍 Où trouver votre fichier APK généré ?
Une fois la compilation terminée, votre fichier APK s'appelle **`masseko.apk`** et se trouve ici :
```
masseko.apk                                            (à la racine du projet)
android/app/build/outputs/apk/debug/masseko.apk       (dans le dossier Android)
```
Vous pouvez copier ce fichier `masseko.apk` directement sur votre téléphone Android par câble USB, WhatsApp, Telegram, Google Drive ou email pour l'installer.

### 🐢 Icône sur votre téléphone après installation
L'icône installée sur votre smartphone est automatiquement **le logo officiel MASSEKO** (la tortue marine émeraude stylisée sur fond bleu océan profond), parfaitement compatible avec tous les lanceurs d'applications (Pixel, Samsung One UI, Xiaomi, etc.) grâce au support complet des icônes adaptatives Android.

---

## 📱 Option B : Ouvrir le projet dans Android Studio (Pour signer l'APK Release)

Si vous préférez l'interface graphique d'Android Studio :

1. Dans le terminal VS Code, lancez :
   ```bash
   npx cap open android
   ```
2. Android Studio s'ouvre automatiquement avec le dossier `android/`.
3. Attendez la synchronisation Gradle en bas à droite.
4. Dans le menu du haut d'Android Studio :
   - Cliquez sur **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
5. Une notification apparaîtra : cliquez sur **"locate"** pour récupérer votre fichier `masseko.apk`.

---

## 🔒 Option C : Générer un APK Release de production

Pour générer un APK Release :
```bash
npm run build:apk:release
```
Le fichier généré sera :
```
masseko.apk                                            (à la racine du projet)
android/app/build/outputs/apk/release/masseko.apk     (dans le dossier Android)
```

---

## ⚙️ Informations sur la configuration
- **Nom de l'application :** `Masseko`
- **Nom du fichier APK :** `masseko.apk`
- **Icône de l'application :** Logo officiel Masseko (Tortue Marine Villi)
- **Fichier de configuration :** `capacitor.config.ts`
