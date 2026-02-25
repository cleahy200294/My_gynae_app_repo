// @ts-nocheck
import { defineConfig } from 'umi';

export default defineConfig({
  // Some dependencies (e.g. swr v2 ESM build) need to be transpiled for Umi/Webpack compatibility
  nodeModulesTransform: {
    type: 'all',
  },

  // Extra safety: explicitly include SWR for Babel processing (in case you later change nodeModulesTransform)
  // Note: Temporarily disabled due to compatibility issues
  // extraBabelIncludes: [
  //   /node_modules\/swr/,
  //   /node_modules\/@ant-design\/pro-/, // pro-* packages that vendor swr
  // ],

  chainWebpack(memo) {
    // Alias yoga-layout to prebuilt version for Webpack 4 compatibility
    memo.resolve.alias.set('yoga-layout', require.resolve('yoga-layout-prebuilt'));

    memo.module
      .rule('mjs')
      .test(/\.mjs$/)
      .type('javascript/auto');

    // Allow importing PDF assets from src/ (e.g. import leaflet from '@/assets/file.pdf')
    memo.module
  .rule('pdf')
  .test(/\.pdf$/)
  .use('file-loader')
  .loader(require.resolve('file-loader'))
  .options({
    name: 'static/[name].[hash:8].[ext]',
  });

    return memo;
  },
  locale: {
    default: 'en-US',
  },
  layout: {
    name: 'MyGynae - Admin',
    layout: 'mix',
    navTheme: 'light',
    siderWidth: 208,
    logo: false,
  },
  routes: [
    {
      path: '/login',
      component: '@/pages/user',
      footerRender: false,
      menuRender: false,
      headerRender: false,
    },
    { path: '/', redirect: '/patient' },
    {
      name: 'Patient',
      icon: 'MedicineBoxFilled',
      path: '/patient',
      hideChildren: true,
      routes: [
        { path: '/patient', redirect: '/patient/list' },
        {
          name: 'Patientlist',
          path: '/patient/list',
          component: '@/pages/patient',
        },
        {
          name: 'Patientdetails',
          path: '/patient/details/:id',
          component: '@/pages/patient/details',
        },
      ],
    },
    {
      name: 'Doctor',
      icon: 'ForkOutlined',
      path: '/doctor',
      component: '@/pages/doctor',
    },
    {
      name: 'Questionnaire',
      path: '/survey',
      hideChildren: true,
      icon: 'ReadFilled',
      routes: [
        { path: '/survey', redirect: '/survey/questionnaire' },
        {
          name: 'questionnaire',
          path: '/survey/questionnaire',
          component: '@/pages/questionnaire',
        },
        {
          name: 'question',
          path: '/survey/question/:id',
          component: '@/pages/question',
        },
        {
          name: 'editSurvey',
          path: '/survey/editSurvey/:id',
          component: '@/pages/editSurvey',
        },
      ],
    },
    {
      name: 'Meeting',
      path: '/meeting',
      hideChildren: true,
      icon: 'MessageFilled',
      routes: [
        { path: '/meeting', redirect: '/meeting/list' },
        {
          name: 'meeting',
          path: '/meeting/list',
          component: '@/pages/meeting',
        },
      ],
    },
  ],
  history: {
    type: 'hash',
  },
  theme: {
    '@text-color': '#24378f',
    '@primary-color': '#4b6bf3',
  },
  hash: true,
  fastRefresh: {},
  base: '/',
  publicPath: './',
});
