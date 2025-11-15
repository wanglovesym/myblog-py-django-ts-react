import { RouterProvider } from "react-router-dom";
import { router } from './router';
import "./index.css";

function App() {

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      {/* 接入页面路由 */}
      <RouterProvider router={router}>
      </RouterProvider>
    </div>
  )
}

export default App
