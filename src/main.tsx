import React from 'react'
import ReactDOM from 'react-dom/client'
import './globals.css'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          <App />
          <Toaster visibleToasts={1} position='top-right' richColors />
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
