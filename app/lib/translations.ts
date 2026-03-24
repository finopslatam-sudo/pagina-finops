/* =====================================================
   TRANSLATIONS — FINOPSLATAM
   Diccionario ES / EN para la plataforma
===================================================== */

export const translations = {

  es: {

    nav: {
      home:          'Inicio',
      services:      'Servicios',
      about:         'Quiénes Somos',
      blog:          'Blog',
      contact:       'Contacto',
      login:         'Login',
      partnerPortal: 'Portal de Socios',
      openMenu:      'Abrir menú',
    },

    menu: {
      myAccount:        'Mi cuenta',
      dashboard:        '📊 Dashboard',
      usersPanel:       '👥 Panel de Usuarios',
      clientsPanel:     '🏢 Panel de Clientes',
      upgradeApprovals: '📈 Aprobaciones de Upgrade',
      supportTickets:   '🎫 Tickets de Soporte',
      findings:         '🔎 Findings & Optimization',
      assets:           '📦 Risk & Assets',
      costs:            '💰 Cost & Financials',
      savings:          '🚀 RI & Savings Plans',
      governance:       '🏛 Governance',
      reports:          '📑 Informes Ejecutivos',
      alerts:           '🔔 Políticas & Alertas',
      aws:              '☁️ AWS Integration',
      orgSettings:      '⚙️ Organization Settings',
      support:          '🎫 Soporte FinopsLatam',
      account:          '👤 Account',
      logout:           '🚪 Logout',
    },

    footer: {
      description:   'Plataforma de optimización financiera para AWS. Monitoreo continuo, detección de hallazgos y reducción de costos en la nube.',
      version:       'Versión 1.0 · Plataforma FinOps',
      supportTitle:  'Soporte',
      legal:         'Legal & Plataforma',
      dataProtected: 'Tus datos están protegidos y cifrados',
      highSecurity:  'Altos estándares de seguridad y privacidad',
      autoScan:      'Escaneos automáticos cada 24 horas',
      rights:        'Todos los derechos reservados',
      tagline:       'Plataforma FinOps para AWS · Chile',
    },

  },

  en: {

    nav: {
      home:          'Home',
      services:      'Services',
      about:         'About Us',
      blog:          'Blog',
      contact:       'Contact',
      login:         'Login',
      partnerPortal: 'Partner Portal',
      openMenu:      'Open menu',
    },

    menu: {
      myAccount:        'My account',
      dashboard:        '📊 Dashboard',
      usersPanel:       '👥 User Panel',
      clientsPanel:     '🏢 Client Panel',
      upgradeApprovals: '📈 Upgrade Approvals',
      supportTickets:   '🎫 Support Tickets',
      findings:         '🔎 Findings & Optimization',
      assets:           '📦 Risk & Assets',
      costs:            '💰 Cost & Financials',
      savings:          '🚀 RI & Savings Plans',
      governance:       '🏛 Governance',
      reports:          '📑 Executive Reports',
      alerts:           '🔔 Policies & Alerts',
      aws:              '☁️ AWS Integration',
      orgSettings:      '⚙️ Organization Settings',
      support:          '🎫 FinopsLatam Support',
      account:          '👤 Account',
      logout:           '🚪 Logout',
    },

    footer: {
      description:   'Financial optimization platform for AWS. Continuous monitoring, finding detection, and cloud cost reduction.',
      version:       'Version 1.0 · FinOps Platform',
      supportTitle:  'Support',
      legal:         'Legal & Platform',
      dataProtected: 'Your data is protected and encrypted',
      highSecurity:  'High security and privacy standards',
      autoScan:      'Automatic scans every 24 hours',
      rights:        'All rights reserved',
      tagline:       'FinOps Platform for AWS · Chile',
    },

  },

} as const;

export type Translations = typeof translations.es;
