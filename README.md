# Manifest Health

A clickable Expo prototype for a wellness intention app. It includes a four-step onboarding flow, selectable and custom health goals, daily actions, mood check-in, a 2-minute health guide, weekly reflection, insights, and profile screens. Choices persist on-device.

## Run the prototype

```bash
npm install
npm run web
```

For native development:

```bash
npm run ios
npm run android
```

Open the web app, click through onboarding, then scroll and tap Today / Goals / Insights / You. Use **I already have a plan** on the first screen to skip into a sample dashboard.

## Store targets

The Expo manifest includes iOS bundle identifier and Android application ID `com.manifesthealth.app`, version/build metadata, icons, splash configuration, and tablet support. Before publishing, replace artwork in `assets/`, confirm a unique bundle identifier, configure EAS credentials, and complete App Store / Google Play wellness questionnaires.

Manifest Health provides general wellness information and does not provide diagnosis, treatment, or medical advice.
