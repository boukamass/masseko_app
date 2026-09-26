# 📱 Guide : Comment générer un vrai fichier APK Android dans VS Code pour KOBA

Ce guide pas-à-pas vous explique comment compiler votre application **KOBA** en fichier **APK installable (.apk)** sur n'importe quel smartphone Android depuis votre terminal **VS Code**.

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

### Étape 3 : Compiler l'application Web & synchroniser avec Android
Exécutez la commande suivante :
```bash
npm run cap:sync
```
*Cette commande va compiler le code React dans le dossier `dist/` puis copier les assets dans le projet Android.*

---

## 📦 Option A : Générer l'APK directement depuis le terminal VS Code (Sans ouvrir Android Studio)

Dans le terminal de VS Code, tapez simplement :

### 👉 Pour un APK de test / debug (le plus rapide) :
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
Une fois la compilation terminée, votre fichier APK se trouve ici :
```
android/app/build/outputs/apk/debug/app-debug.apk
```
Vous pouvez copier ce fichier `app-debug.apk` directement sur votre téléphone Android par câble USB, WhatsApp, Telegram, Google Drive ou email pour l'installer et le tester !

---

## 📱 Option B : Ouvrir le projet dans Android Studio (Recommandé pour signer l'APK Release)

Si vous préférez l'interface graphique d'Android Studio :

1. Dans le terminal VS Code, lancez :
   ```bash
   npx cap open android
   ```
2. Android Studio s'ouvre automatiquement avec le dossier `android/`.
3. Attendez la synchronisation Gradle en bas à droite.
4. Dans le menu du haut d'Android Studio :
   - Cliquez sur **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
5. Une notification apparaîtra : cliquez sur **"locate"** pour récupérer votre fichier `app-debug.apk` ou `app-release.apk`.

---

## 🔒 Option C : Générer un APK Release optimisé & signé pour la production

Pour générer un APK optimisé :
```bash
cd android
./gradlew assembleRelease
# Sur Windows : .\gradlew.bat assembleRelease
```
Le fichier se trouvera dans :
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## ⚙️ Configuration du projet Capacitor
- **App ID (Package Name) :** `com.koba.oceanguard`
- **Nom de l'application :** `KOBA`
- **Fichier de configuration :** `capacitor.config.ts`

Toutes les configurations sont prêtes !
