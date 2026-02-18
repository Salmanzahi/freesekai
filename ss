[33mcommit 3a88bda349aa3937a90dd21bce26be9789ff09b2[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfeature[m[33m, [m[1;31morigin/feature[m[33m, [m[1;32mmain[m[33m)[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Tue Feb 17 15:46:47 2026 +0700

    feat: Implement login page with Firebase authentication and update Next.js dependencies.

[33mcommit b9f5195ed8a6a730df4e6c4dda311681d951c0c7[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Mon Feb 16 23:16:49 2026 +0700

    feat: Implement core user authentication, content creation with rich editor, and initial site structure.

[33mcommit 42e5e079b5b9431cd233728408e16fd8137b4002[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Wed Oct 15 23:05:08 2025 +0700

    feat: implement user registration with additional properties and integrate Quill editor
    
    - Enhanced `registerUserWithEmailAndPassword` function to include username and store user properties in the database.
    - Created a new `QuillEditor` component for rich text editing.
    - Added new UI components including `Dialog`, `Sidebar`, `Switch`, and `Tooltip`.
    - Introduced hooks for mobile detection and authentication state management.
    - Set up Supabase client for future database interactions.
    - Added type declarations for CSS modules.

[33mcommit ea8b5e1daf92895172724ea64331f9e8b354f55c[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Wed Aug 27 22:42:26 2025 +0700

    rws

[33mcommit d3a63d2143d49d347175dc24b74623b13b4a4e3d[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Wed Aug 27 22:39:59 2025 +0700

    feat(auth): implement login and register pages with firebase integration
    
    - Add new alert component for form validation
    - Create register service with firebase auth
    - Implement password visibility toggle
    - Move CardLoad component to main page
    - Update navigation drawer and dropdown menu

[33mcommit d6005b203e832377b100542d147df71004175fbf[m[33m ([m[1;31morigin/develop[m[33m, [m[1;32mdevelop[m[33m)[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Wed Aug 27 20:05:15 2025 +0700

    sssdsdsasdas

[33mcommit a7f7872ce7c3f1e12c7c6043f5618335beb9a074[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Tue Aug 26 21:50:31 2025 +0700

    feat(home): add secondary hero section component
    
    Introduce new SecHero component as a placeholder for secondary hero content

[33mcommit e27060296de0a67266c2c59e4010ff783508a8b2[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Tue Aug 26 21:14:16 2025 +0700

    feat(ui): add new UI components and implement post loading functionality
    
    - Add skeleton, aspect-ratio, avatar, separator, and badge components
    - Implement post loading with Firebase realtime database integration
    - Create login and register pages with basic layout
    - Update next.config with image domains and firebase configuration
    - Replace secHero with cardload component for post display

[33mcommit c1d6bcd266f2fc9b58784c190b623de655ff28b4[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sun Aug 24 09:22:05 2025 +0700

    feat(nav): add account dropdown with login/register links
    
    refactor(home): move SecHero component into HeroPage
    chore(deps): add @radix-ui/react-select package
    feat(ui): implement Select component with radix primitives

[33mcommit 2c5eda281d5005580a927125068f8d394fbb12b2[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sat Aug 23 22:18:10 2025 +0700

    feat(ui): implement drawer component and update hero section styling
    
    - Replace Sheet component with new Drawer component for mobile navigation
    - Add scroll behavior and transparency effects to navbar
    - Update hero section layout and animations
    - Adjust color scheme and typography in globals.css
    - Add vaul dependency for drawer functionality

[33mcommit 3b7c0e14a8401fd0f662b123efad48ab53be8745[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sat Aug 23 19:10:26 2025 +0700

    feat: add UI components and theme support with dark mode
    
    - Add new UI components (button, card, dropdown, input, label, sheet, tabs)
    - Implement theme provider with dark mode support
    - Update global styles and add theme variables
    - Replace coming soon page with new hero sections
    - Add mobile responsive navigation with sheet component
    - Include new dependencies for UI components and theming

[33mcommit b335b17052373381c43fe4a22f2b07f262c0f4d8[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Mon Aug 4 14:56:22 2025 +0700

    refactor: clean up unused imports and update coming soon message
    
    Remove unused imports from page.tsx and improve text formatting in comingsoon.tsx

[33mcommit 7f535cacacbecdded52ba3c626461ffcecc02a09[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sun Aug 3 23:17:53 2025 +0700

    docs(comingsoon): update maintenance message wording
    
    Improve clarity and readability of the maintenance explanation message

[33mcommit 7f9e78e3495377bcc6d6b9c6347e535d0c86ac52[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sun Aug 3 23:10:59 2025 +0700

    feat: add new navigation and coming soon page with tech icons
    
    - Implement new Nav component with links and branding
    - Add ComingSoon component showcasing tech stack icons
    - Update global styles with new color scheme and font
    - Replace default page with maintenance message and tech stack visualization
    - Add SVG icons for HTML, CSS, JS, React, and Next.js

[33mcommit 615cb4dd05609df6d522eb4900af7f9075b3707a[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sun Aug 3 21:53:58 2025 +0700

    first commit

[33mcommit 16326ab59f8ee4391ff7a00276b9c13bd61544ce[m
Author: SalmanZahi <salmanzahi1104@gmail.com>
Date:   Sun Aug 3 21:50:51 2025 +0700

    Initial commit from Create Next App
