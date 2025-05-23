export const common = {
	isDev: process.env.NODE_ENV === 'development',
	meta: {
		siteName: 'Visualization Maker',
		title: 'Visualization Maker',
		description: 'Some desc',
		domain: 'https://visualization-maker.com',
		keywords: '',
		author: 'Andrey (Ravy) Rovnyi',
	},
	contacts: {
		email: 'contact@visualization-maker.com',
		telegramLink: 'https://t.me/xploitravy'
	},
	copyright: {
		company: `© 2006-${new Date().getFullYear()} XPLOIT LTD. All Rights Reserved`
	}

}

export type common = typeof common
