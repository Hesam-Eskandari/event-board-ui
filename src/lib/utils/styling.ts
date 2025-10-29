import type { Position } from '$lib/types/types';

export class Styling {
	static getStylingForPosition(position: Position, padding: number = 10): object {
		let styling: {[key: string]: any} = { position: 'absolute', top: 0, left: 0 };
		switch (position) {
			case 'top':
				styling = {
					...styling,
					top: `${padding}px`,
					left: '50%',
					transform: 'translateX(-50%)'
				};
				break;
			case 'top-left':
				styling = {
					...styling,
					top: `${padding}px`,
					left: `${padding}px`
				};
				break;
			case 'top-right':
				styling = {
					position: 'absolute',
					top: `${padding}px`,
					right: `${padding}px`,
				}
				break;
			case 'left':
				styling = {
					position: 'absolute',
					top: '50%',
					left: `${padding}px`,
					transform: 'translateY(-50%)',
				}
				break;
			case 'right':
				styling = {
					position: 'absolute',
					top: '50%',
					right: `${padding}px`,
					transform: 'translateY(-50%)',
				}
				break;
			case 'bottom-left':
				styling = {
					position: 'absolute',
					bottom: `${padding}px`,
					left: `${padding}px`,
				}
				break;
			case 'bottom-right':
				styling = {
					position: 'absolute',
					bottom: `${padding}px`,
					right: `${padding}px`,
				}
				break;
			case 'bottom':
				styling = {
					position: 'absolute',
					bottom: `${padding}px`,
					left: '50%',
					transform: 'translateX(-50%)',
				}
				break;
		}
		return styling;
	}

	static ConvertStyleToString(style: object): string {
		return Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ');
	}
}
