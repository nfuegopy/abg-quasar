<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentación de Frontend Quasar</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">

</head>
<body>
    <header>
        <h1>Frontend Quasar</h1>
    </header>
    <article>
        <section>
            <h2>Información General</h2>
            <p><strong>Nombre:</strong> Frontend Quasar</p>
            <p><strong>Descripción:</strong> API para sistema base con login, auth, conexión a firebase.</p>
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Ultima Actualización:</strong> 01/07/2024 – 17:20</p>
            <p><strong>Repositorio:</strong> <a href="https://github.com/nfuegopy/abg-quasar">https://github.com/nfuegopy/abg-quasar</a></p>
            <p><strong>Link Estructura Carpetas:</strong> acceso</p>
            <p><strong>Desarrollador:</strong> Antonio Cesar Barrios Leguizamón</p>
        </section>
        <section>
            <h2>Estructura de Carpetas</h2>
            <div class="structure">
                <i class="fas fa-folder-open icon-folder"></i> ABG-QUASAR-APP/
                <br>├── <i class="fas fa-folder icon-folder"></i> src/
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> assets/
                <br>│   │   └── <i class="fas fa-image icon-file"></i> icon
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> boot/
                <br>│   │   ├── <i class="fas fa-file-code icon-file"></i> axios.ts
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> pinia.ts
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> components/
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> LoginForm.vue
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> css
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> layouts/
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> MainLayout.vue
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> modules/
                <br>│   │   ├── <i class="fas fa-folder icon-folder"></i> Clients/
                <br>│   │   │   ├── <i class="fas fa-folder icon-folder"></i> Controller/
                <br>│   │   │   │   └── <i class="fas fa-file-code icon-file"></i> ClientController.ts
                <br>│   │   │   ├── <i class="fas fa-folder icon-folder"></i> Model/
                <br>│   │   │   │   └── <i class="fas fa-file-code icon-file"></i> Client.ts
                <br>│   │   │   ├── <i class="fas fa-folder icon-folder"></i> Repositories/
                <br>│   │   │   │   └── <i class="fas fa-file-code icon-file"></i> ClientRepository.ts
                <br>│   │   │   └── <i class="fas fa-folder icon-folder"></i> View/
                <br>│   │   │       └── <i class="fas fa-file-code icon-file"></i> ClientsPage.vue
                <br>│   │   └── <i class="fas fa-folder icon-folder"></i> Defendants/
                <br>│   │       ├── <i class="fas fa-folder icon-folder"></i> Controller/
                <br>│   │       │   └── <i class="fas fa-file-code icon-file"></i> DefendantController.ts
                <br>│   │       ├── <i class="fas fa-folder icon-folder"></i> Model/
                <br>│   │       │   └── <i class="fas fa-file-code icon-file"></i> Defendant.ts
                <br>│   │       ├── <i class="fas fa-folder icon-folder"></i> Repositories/
                <br>│   │       │   └── <i class="fas fa-file-code icon-file"></i> DefendantRepository.ts
                <br>│   │       └── <i class="fas fa-folder icon-folder"></i> View/
                <br>│   │           └── <i class="fas fa-file-code icon-file"></i> DefendantPage.vue
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> pages/
                <br>│   │   ├── <i class="fas fa-file-code icon-file"></i> LoginPage.vue
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> IndexPage.vue
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> router/
                <br>│   │   ├── <i class="fas fa-file-code icon-file"></i> index.ts
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> routes.ts
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> stores/
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> auth.ts
                <br>│   ├── <i class="fas fa-folder icon-folder"></i> types/
                <br>│   │   └── <i class="fas fa-file-code icon-file"></i> jwt-decode.d.ts
                <br>│   ├── <i class="fas fa-file-code icon-file"></i> App.vue
                <br>│   ├── <i class="fas fa-file-code icon-file"></i> env.d.ts
                <br>│   ├── <i class="fas fa-file-code icon-file"></i> quasar.d.ts
                <br>│   └── <i class="fas fa-file-code icon-file"></i> shims-vue.d.ts
                <br>├── <i class="fas fa-file-code icon-file"></i> editconfig
                <br>├── <i class="fas fa-file-code icon-file"></i> index.html
                <br>├── <i class="fas fa-file-code icon-file"></i> package.json
                <br>├── <i class="fas fa-file-code icon-file"></i> quasar.config.js
                <br>└── <i class="fas fa-file-code icon-file"></i> tsconfig.json
            </div>
        </section>
    </article>
</body>
</html>
