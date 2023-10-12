import { createRoot } from 'react-dom/client'
import App from './src/App.tsx'
import ToastContextProvider from './src/components/shared/toast/ToastContextProvider.tsx'
import 'primeicons/primeicons.css'
import { BrowserRouter } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))
root.render(
  <ToastContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ToastContextProvider>
)
