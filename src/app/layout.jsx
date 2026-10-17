import StyledComponentsRegistry from '../lib/registry';
import '../index.css';

export const metadata = {
  title: 'Board - Collaborative Whiteboard',
  description: 'Infinite canvas virtual whiteboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}

