import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className={GeistSans.className}>
			<body className='bg-background text-foreground'>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
