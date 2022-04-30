module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['next/core-web-vitals', 'prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'linebreak-style': ['error', 'unix'],
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
			},
		],
		semi: ['error', 'always'],
		quotes: ['error', 'single', 'avoid-escape'],
	},
};
