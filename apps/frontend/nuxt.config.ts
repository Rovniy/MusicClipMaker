import { common } from './config/index'
import {fileURLToPath} from "node:url";

export default defineNuxtConfig({
    alias: {
        '#config': fileURLToPath(new URL('./config', import.meta.url)),
    },
    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
            meta: [
                {property: 'og:locale', content: 'en_US'},
                {property: 'og:site_name', content: common.meta.siteName},
                {property: 'og:logo', content: `${common.meta.domain}/xploit_logo.png`},
                {property: 'og:url', content: common.meta.domain},
                {property: 'og:type', content: 'website'},
                {property: 'og:title', content: common.meta.title},
                {property: 'og:description', content: common.meta.description},
                {property: 'og:image', content: `${common.meta.domain}/xploit_og.jpg`},
                {property: 'og:image:width', content: '1200'},
                {property: 'og:image:height', content: '630'},
                {property: 'twitter:card', content: 'summary_large_image'},
                {property: 'twitter:domain', content: common.meta.domain},
                {property: 'twitter:url', content: common.meta.domain},
                {property: 'twitter:title', content: 'XPLOIT ltd.'},
                {property: 'twitter:description', content: common.meta.description},
                {property: 'twitter:image', content: `${common.meta.domain}/xploit_og.jpg`}
            ]
        }
    },

    devtools: {enabled: true},

    modules: ['@nuxt/image'],

    compatibilityDate: '2025-08-05',

    css: [
        '@/assets/style/style.sass',
    ],

    image: {
        format: ['webp'],
        quality: 80,
        dir: 'assets/images'
    },

    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    additionalData: '@use "@/assets/style/vars.sass" as *\n',
                },
            },
        },
    },
})
