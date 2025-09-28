# Angular i18n Implementation Guide

## Overview
This project now supports internationalization (i18n) for Hebrew and English languages using Angular's built-in i18n functionality.

## Configuration

### 1. Angular Configuration (`angular.json`)
The project is configured with:
- Source locale: `en-US`
- Supported locales: `en` and `he`
- Translation files: `src/locale/messages.en.xlf` and `src/locale/messages.he.xlf`

### 2. Package Dependencies
- `@angular/localize@^19.1.0` - Required for i18n functionality

### 3. Translation Files
- **English**: `src/locale/messages.en.xlf`
- **Hebrew**: `src/locale/messages.he.xlf`

## Usage

### Building for Different Locales

#### English Build
```bash
ng build --configuration=en
```
Output: `dist/almog-frontend/en/`

#### Hebrew Build
```bash
ng build --configuration=he
```
Output: `dist/almog-frontend/he/`

#### Build Both Locales
```bash
npm run build:i18n
```

### Development Server

#### English Development
```bash
ng serve --configuration=en --port=3040
```

#### Hebrew Development
```bash
ng serve --configuration=he --port=3040
```

### Extracting Translation Messages
```bash
ng extract-i18n
```
This extracts all i18n messages from templates and updates the source translation file.

## Template Implementation

### Adding i18n Attributes
To make text translatable, add the `i18n` attribute:

```html
<!-- Simple text -->
<h1 i18n="@@season.title">Create New Season</h1>

<!-- With interpolation -->
<p i18n="@@season.loading">{{ seasonId ? 'Loading season...' : 'Creating season...' }}</p>

<!-- Form labels -->
<mat-label i18n="@@season.name.label">Season Name</mat-label>

<!-- Placeholders -->
<input placeholder="e.g., Summer 2024" i18n-placeholder="@@season.name.placeholder">

<!-- Error messages -->
<mat-error i18n="@@season.name.required">Season name is required</mat-error>
```

### Message ID Convention
Use descriptive IDs with dot notation:
- `@@season.title` - Season page title
- `@@season.name.label` - Season name field label
- `@@season.name.required` - Season name validation error
- `@@common.cancel` - Common cancel button

## Translation Process

### 1. Extract Messages
After adding i18n attributes to templates:
```bash
ng extract-i18n
```

### 2. Translate Messages
Edit the translation files (`messages.he.xlf`) to add Hebrew translations:

```xml
<trans-unit id="season.title" datatype="html">
  <source><x id="INTERPOLATION" equiv-text="{{ seasonId ? 'Edit Season' : 'Create New Season' }}"/></source>
  <target><x id="INTERPOLATION" equiv-text="{{ seasonId ? 'עריכת עונה' : 'יצירת עונה חדשה' }}"/></target>
</trans-unit>
```

### 3. Build and Test
```bash
ng build --configuration=he
```

## File Structure
```
src/
├── locale/
│   ├── messages.en.xlf      # English translations
│   ├── messages.he.xlf      # Hebrew translations
│   └── locale.manifest.json # Locale configuration
└── components/
    └── pages/
        └── seasons/
            └── seasons-form/
                └── seasons-form.component.html  # Example with i18n attributes
```

## Scripts Added to package.json
- `extract-i18n`: Extract i18n messages from templates
- `build:i18n`: Build both English and Hebrew versions
- `serve:en`: Serve English version on port 3040
- `serve:he`: Serve Hebrew version on port 3040

## Example Implementation
The seasons form component (`seasons-form.component.html`) has been updated with i18n attributes as an example. It includes:
- Page titles and headers
- Form labels and placeholders
- Validation error messages
- Button text
- Tooltips

## Next Steps
1. Add i18n attributes to other components
2. Extract messages: `ng extract-i18n`
3. Translate messages in `messages.he.xlf`
4. Test both locales: `npm run build:i18n`
5. Deploy both versions to appropriate URLs

## Notes
- Hebrew text is right-to-left (RTL) - consider adding RTL CSS support
- Some Angular Material components may need additional RTL configuration
- Consider using Angular's `LOCALE_ID` token for locale-specific formatting
